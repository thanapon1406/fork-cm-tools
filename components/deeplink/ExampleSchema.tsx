const ExampleInternalSchema = () => {
  return (
    <>
      <div>
        * ตัวอย่าง
      </div>
      <div>khconsumer://host?outletId=xxx&productId=xxxx&app=consumer</div>
      <div>khconsumer://host?page=search&keyword=ส้มตำ <span style={{ color: "#000" }}>(แสดงหน้าค้นหา "ส้มตำ")</span></div>
      <div>khconsumer://host?page=campaign <span style={{ color: "#000" }}>(แสดงหน้า Coupon list)</span></div>
      <div>khconsumer://host?page=campaign&campaignId=x <span style={{ color: "#000" }}>(แสดงหน้า Coupon detail)</span></div>
      <div>khconsumer://host?page=promotion&outletId=x <span style={{ color: "#000" }}>(แสดงหน้า List โปรโมชั่นร้านค้า)</span></div>
      <div>khconsumer://host?page=promotion&outletId=x&promotionId=x <span style={{ color: "#000" }}>(แสดงหน้า Detail โปรโมชั่นร้านค้า)</span></div>
    </>
  )
}

export default ExampleInternalSchema