import errorHandler from './handler/errorHandler'
import successHandler from './handler/successHandler'

interface queryList {
  id?: string
  keyword?: string
  type?: string
  start_date?: string
  end_date?: string
}

interface queryById {
  id?: string
}

interface response {
  success: boolean
  result: any
}

const getLalamoveWallet = async (body: queryList) => {
  try {
    // const result = await fetch.post(`/api/credit/transactions`, body)
    let result = {
      data: {
        "message": "success",
        "data": [
          {
            "id": 89,
            "order_no": "d5e4a0f0-7e81-4c14-94d0-be67c6a21d89",
            "transaction_id": "20211102172651QXJP",
            "type": "top-up",
            "description": "เติมเงินเข้ากระเป๋าตังค์",
            "amount": 1000,
            "status": "success",
            "created_at": "2021-11-02T10:26:50.860Z",
            "updated_at": "2021-11-02T10:28:31.745Z",
            "rider_name": "-",
          },
          {
            "id": 88,
            "order_no": "ae762953-d62d-4991-bf1f-ddaf13b9d369",
            "transaction_id": "20211102112046WAPC",
            "type": "decrease",
            "description": "จัดส่งสำเร็จ (ae762953-d62d-4991-bf1f-ddaf13b9d369) ",
            "amount": 66,
            "status": "success",
            "created_at": "2021-11-02T04:20:46.217Z",
            "updated_at": "2021-11-02T04:20:52.443Z",
            "rider_name": "ชื่อไรเดอร์ นามสกุล",
          },
          {
            "id": 87,
            "order_no": "LALAMOVE คืนเงิน (Order ID)",
            "transaction_id": "202111021109327PLU",
            "type": "increase",
            "description": "LALAMOVE คืนเงิน (LALAMOVE คืนเงิน (Order ID))",
            "amount": 35,
            "status": "success",
            "created_at": "2021-11-02T04:09:31.553Z",
            "updated_at": "2021-11-02T04:16:26.682Z",
            "rider_name": "ชื่อไรเดอร์ นามสกุล",
          },
          {
            "id": 86,
            "order_no": "afc7672b-5c52-4095-8947-92634bdbb61e",
            "transaction_id": "20211102104141X0YF",
            "type": "decrease",
            "description": "ชำระเงินให้ LALAMOVE (afc7672b-5c52-4095-8947-92634bdbb61e)",
            "amount": 35,
            "status": "success",
            "created_at": "2021-11-02T03:41:40.904Z",
            "updated_at": "2021-11-02T03:42:36.302Z",
            "rider_name": "ชื่อไรเดอร์ นามสกุล",
          },
        ],
        "meta": {
          "page": 1,
          "per_page": 10,
          "page_count": 1,
          "total_count": 4
        }
      },
      status: 200
    }
    return successHandler(result)
  } catch (error) {
    return errorHandler(error)
  }
}

export { getLalamoveWallet }

