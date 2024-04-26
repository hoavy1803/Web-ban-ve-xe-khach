from fastapi import FastAPI, HTTPException, Request, Depends, Form
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import mysql.connector
from pydantic import BaseModel
from connect_db import *


templatesAdmin = Jinja2Templates(directory="D:\\Năm 3\\CSDL web\\THỰC HÀNH WEB\\ban-ve-xe-khach\\frontend\\admin\\templates")

app.mount("/img-a", StaticFiles(directory="D:\\Năm 3\\CSDL web\\THỰC HÀNH WEB\\ban-ve-xe-khach\\frontend\\admin\\img-a"), name="img-a")
app.mount("/css-a", StaticFiles(directory="D:\\Năm 3\\CSDL web\\THỰC HÀNH WEB\\ban-ve-xe-khach\\frontend\\admin\\css-a"), name="css-a")
app.mount("/js-a", StaticFiles(directory="D:\\Năm 3\\CSDL web\\THỰC HÀNH WEB\\ban-ve-xe-khach\\frontend\\admin\\js-a"), name="js-a")


@app.get("/admin_system.html", response_class=HTMLResponse)
async def readAdmin(request: Request):
    return templatesAdmin.TemplateResponse("admin_system.html", {"request": request})


class AccountFilter(BaseModel):
    accName: str
    accMailPhone: str
    accType: str


def execute_query(query, params=None):
    cursor = conn.cursor()

    try:
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)

        result = cursor.fetchall()
        return result

    finally:
        cursor.close()
        conn.close()


@app.post("/filter_accounts")
async def filter_accounts(data: AccountFilter):
    acc_name = data.accName
    acc_mailphone = data.accMailPhone
    acc_type = data.accType
    if acc_type == "Khách hàng":
        query = f"""
                SELECT *
                FROM khachhang
                WHERE tenKhachHang = '{acc_name}' AND soDienThoai = '{acc_mailphone}'
            """
        params = (acc_name, acc_mailphone,acc_type)
    elif acc_type in ["Admin", "Quản lý"]:
        query = f"""
                SELECT maNhanVien, tenNhanVien, chucVu, ngaySinh, gioiTinh, diaChi, soDienThoai_NV, luong, email
                FROM nhanvien
                WHERE chucVu = '{acc_type}'
            """
        params = ("Admin" if acc_type == "Admin" else "Quản lý",)

    results = execute_query(query, params)

    # Lọc cột mật khẩu ra khỏi danh sách tên cột
    filtered_column_names = [col for col in cursor.column_names if col != 'matKhau']

    # Tạo danh sách kết quả mà không có cột mật khẩu
    results_without_password = [{col: row[col] for col in filtered_column_names} for row in results]

    return results_without_password



# Thêm 1 hàng vào bảng khachhang
@app.get("/add_kh", response_class=HTMLResponse)
async def add_kh_form(request: Request):
    return {"request": request}


@app.post("/add_kh")
async def add_kh(
    tenKhachHang: str = Form(...),
    email: str = Form(...),
    soDienThoai_KH: int = Form(...),
    soTaiKhoanNH: str = Form(...),
    matKhau: str = Form(...),
):
    cursor = conn.cursor()
   
    try:
        # Kiểm tra xem số điện thoại đã tồn tại hay chưa
        cursor.execute("SELECT * FROM khachhang WHERE soDienThoai_KH = %s", (soDienThoai_KH,))
        existing_user = cursor.fetchone()
        if existing_user:
            # return {"message": "Số điện thoại đã tồn tại"}
            raise HTTPException(status_code=400, detail="Email đã tồn tại")

        # Nếu số điện thoại chưa tồn tại, thêm khách hàng mới
        cursor.execute(
            "INSERT INTO khachhang (tenKhachHang, email, soDienThoai_KH, soTaiKhoanNH, matKhau) VALUES (%s, %s, %s, %s, %s)",
            (tenKhachHang, email, soDienThoai_KH, soTaiKhoanNH, matKhau),
        )
        conn.commit()
        return {"message": "Đã thêm khách hàng thành công"}
    except mysql.connector.Error as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()


@app.get("/users")
async def get_all_users(request: Request):
    cursor = conn.cursor() 
    cursor.execute(
        "SELECT maKhachHang, tenKhachHang, email, soDienThoai_KH, 'Khách hàng' AS chucVu FROM khachhang UNION ALL SELECT maNhanVien, tenNhanVien, email, soDienThoai_NV, chucVu FROM nhanvien"
    )
    data = cursor.fetchall() 
    cursor.close()
    return templatesAdmin.TemplateResponse(
        "admin.html", {"request": request, "data": data}
    )




# Edit bảng khachhang
@app.get("/edit_kh/{id}", response_class=HTMLResponse)
async def edit_khachhang_form(request: Request):
    return templatesAdmin.TemplateResponse("edit_khachhang.html", {"request": request})



@app.post("/edit_kh")
async def edit_khachhang(
    maKhachHang: int = Form(...),
    tenKhachHang: str = Form(...),
    email: str = Form(...),
    soDienThoai_KH: int = Form(...),
    soTaiKhoanNH: str = Form(...),
    matKhau: str = Form(...),
):
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE khachhang SET tenKhachHang = %s, email = %s, soDienThoai_KH = %s, soTaiKhoanNH = %s, matKhau = %s WHERE maKhachHang = %s",
            (tenKhachHang, email, soDienThoai_KH, soTaiKhoanNH, matKhau, maKhachHang),
        )
        conn.commit()
        return {"message": "Đã cập nhật thông tin khách hàng thành công"}
    except mysql.connector.Error as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()


# Xóa 1 hàng dựa trên mã khách hàng của bảng khachhang
@app.get("/delete_kh/{id}", response_class=HTMLResponse)
async def delete_khachhang(request: Request):
    return templatesAdmin.TemplateResponse("delete_khachhang.html", {"request": request})


@app.post("/delete_kh")
async def delete_khachhang_post(maKhachHang: int = Form(...)):
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM khachhang WHERE maKhachHang = %s", (maKhachHang,))
        conn.commit()
        return {"message": "Deleted successfully"}
    except mysql.connector.Error as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()


# Edit bảng nhanvien
@app.get("/edit_nv/{id}", response_class=HTMLResponse)
async def edit_nhanvien_form(request: Request):
    return templatesAdmin.TemplateResponse("edit_nhanvien.html", {"request": request})


@app.post("/edit_nv")
async def edit_nhanvien(
    maNhanVien: int = Form(...),
    tenNhanVien: str = Form(...),
    chucVu: str = Form(...),
    ngaySinh: str = Form(...),
    gioiTinh: str = Form(...),
    diaChi: str = Form(...),
    soDienThoai_NV: int = Form(...),
    luong: int = Form(...),
    email: str = Form(...),
    matKhau: str = Form(...),
):
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE nhanvien SET tenNhanVien = %s, chucVu = %s, ngaySinh = %s, gioiTinh = %s, diaChi = %s, soDienThoai_NV = %s, luong = %s, email = %s, matKhau = %s WHERE maNhanVien = %s",
            (
                tenNhanVien,
                chucVu,
                ngaySinh,
                gioiTinh,
                diaChi,
                soDienThoai_NV,
                luong,
                email,
                matKhau,
                maNhanVien,
            ),
        )
        conn.commit()
        return {"message": "Đã cập nhật thông tin nhân viên thành công"}
    except mysql.connector.Error as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()


# Xóa 1 hàng dựa trên mã nhân viên của bảng nhanvien
@app.get("/delete_nv/{id}", response_class=HTMLResponse)
async def delete_nhanvien(request: Request):
    return templatesAdmin.TemplateResponse("delete_nhanvien.html", {"request": request})


@app.post("/delete_nv")
async def delete_nhanvien_post(request: Request, maNhanVien: int = Form(...)):
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM nhanvien WHERE maNhanVien = %s", (maNhanVien,))
        conn.commit()
        return {"message": "Deleted successfully"}
    except mysql.connector.Error as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
