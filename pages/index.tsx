import Card from '@/components/Card'
import MainLayout from '@/layout/MainLayout'
import { getDashboardOrderCancelSummary, getDashboardOrderSummary } from '@/services/report'
import { blue, grey, red, yellow } from '@ant-design/colors'
import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Divider,
  Radio,
  Row,
  Spin,
  Typography
} from 'antd'
import { useFormik } from 'formik'
import Highcharts, { numberFormat } from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import AnnotationsFactory from "highcharts/modules/annotations"
import { filter, find, get, has, size, sumBy } from 'lodash'
import moment, { Moment } from 'moment'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'

if (typeof Highcharts === 'object') {
  AnnotationsFactory(Highcharts);
}

const { Text } = Typography

const { Title } = Typography
const { RangePicker } = DatePicker

const CancelColors = [
  {
    id: 1,
    name: 'ฉันต้องการแก้ไขที่อยู่จัดส่ง',
    subString: 'ฉันต้องการแก้ไขที่อยู่จัดส่ง',
    color: blue[2],
    group: 1,
  },
  {
    id: 2,
    name: 'ฉันต้องการแก้ไขรายการสั่งซื้อ',
    subString: 'ฉันต้องการแก้ไขรายการสั่งซื้อ',
    color: blue[3],
    group: 1,
  },
  {
    id: 3,
    name: 'ฉันรอนานเกินไป',
    subString: 'ฉันรอนานเกินไป',
    color: blue[4],
    group: 1,
  },
  {
    id: 4,
    name: 'เหตุผลอื่นๆ',
    subString: 'เหตุผลอื่นๆ',
    color: blue[5],
    group: 1,
  },
  {
    id: 0,
    name: 'ลูกค้าไม่ชำระเงินภายใน 15 นาที',
    subString: 'ลูกค้าไม่ชำระเงิน',
    color: blue[6],
    group: 1,
  },
  {
    id: 0,
    name: 'ร้านค้าไม่รับออเดอร์ภายใน 10 นาที',
    subString: 'ร้านค้าไม่รับออเดอร์',
    color: red[2],
    group: 2,
  },
  {
    id: 6,
    name: 'ช่วงเวลาเร่งด่วน ออเดอร์เยอะเกินไป',
    subString: 'ออเดอร์เยอะเกินไป',
    color: red[3],
    group: 2,
  },
  {
    id: 9,
    name: 'เกิดความผิดพลาดในการปรุงอาหาร',
    subString: 'เกิดความผิดพลาดในการปรุงอาหาร',
    color: red[4],
    group: 2,
  },
  {
    id: 5,
    name: 'วัตถุดิบหมด',
    subString: 'วัตถุดิบหมด',
    color: red[5],
    group: 2,
  },
  {
    id: 7,
    name: 'เกิดอุบัติเหตุฉุกเฉิน',
    subString: 'เกิดอุบัติเหตุฉุกเฉิน',
    color: red[6],
    group: 2,
  },
  {
    id: 10,
    name: 'อื่นๆ (โปรดระบุ)',
    subString: 'โปรดระบุ',
    color: red[7],
    group: 2,
  },
  {
    id: 8,
    name: 'ไม่มีไรเดอร์รับออเดอร์',
    subString: 'ไม่มีไรเดอร์รับออเดอร์',
    color: yellow[3],
    group: 3,
  },
  {
    id: 0,
    name: 'ยกเลิกโดยผู้ดูเเลระบบ',
    subString: 'ยกเลิกโดยผู้ดูเเลระบบ',
    color: grey[3],
    group: 4,
  },
  // {
  //   id: 0,
  //   name: 'Auto Cancel',
  //   subString: 'Auto',
  //   color: green[5],
  //   group: 5,
  // },
]

const CancelGroup = [
  {
    name: 'ลูกค้า',
    color: blue[4],
    substringList: [
      'ฉันต้องการแก้ไขที่อยู่จัดส่ง',
      'ฉันต้องการแก้ไขรายการสั่งซื้อ',
      'ฉันรอนานเกินไป',
      'เหตุผลอื่นๆ',
      'ลูกค้าไม่ชำระเงิน',
    ],
  },
  {
    name: 'ร้านค้า',
    color: red[5],
    substringList: [
      'ร้านค้าไม่รับออเดอร์',
      'ออเดอร์เยอะเกินไป',
      'เกิดความผิดพลาดในการปรุงอาหาร',
      'วัตถุดิบหมด',
      'เกิดอุบัติเหตุฉุกเฉิน',
      'โปรดระบุ',
    ],
  },
  {
    name: 'ไรเดอร์',
    color: yellow[3],
    substringList: ['ไม่มีไรเดอร์รับออเดอร์'],
  },
  {
    name: 'แอดมิน',
    color: grey[3],
    substringList: ['ยกเลิกโดยผู้ดูเเลระบบ'],
  },
  // {
  //   name: 'ระบบ',
  //   color: green[5],
  //   substringList: ['Auto'],
  // },
]

type FormInterFace = {
  picker_type: 'date' | 'week' | 'month'
  dates: [Moment, Moment]
}

type PieDataInterface = {
  y: number
  name: string
  color: string
}

type AnnotationSeriesData = {
  y: number
  id?: string
  custom_percentage?: string
}

const defaultSelDate: [Moment, Moment] = [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')]
const defaultSelWeek: [Moment, Moment] = [
  moment().subtract(3, 'weeks').isoWeekday(2),
  moment().isoWeekday(2),
] //this week @tuesday
const defaultSelMonth: [Moment, Moment] = [
  moment().subtract(11, 'months').startOf('months'),
  moment(),
]

const initialValues: FormInterFace = {
  picker_type: 'date',
  dates: defaultSelDate,
}

const Home: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [chartData, setChartData] = useState<number[][]>([])
  const [chartxAxis, setChartxAxis] = useState<string[] | number[]>([])
  const [cancellationPieData, setCancellationPieData] = useState<PieDataInterface[]>([])
  const [cancellationGroupPieData, setCancellationGroupPieData] = useState<PieDataInterface[]>([])

  const handleSubmit = async () => {
    await fetchOrdersSummaryReport(formik.values)
    await fetchOrdersCancelSummaryReport(formik.values)
  }

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: () => {
      handleSubmit()
    },
    validationSchema: Yup.object().shape({
      dates: Yup.array().min(1, 'กรุณาเลือกวัน').required('กรุณาเลือกวัน').nullable(),
    }),
  })

  const fetchOrdersSummaryReport = async (values: FormInterFace) => {
    if (size(values.dates) < 2) {
      return
    }
    setLoading(true)

    let queryStartDate = values.dates[0]
    let queryEndDate = values.dates[1]

    if (values.picker_type == 'week') {
      queryStartDate = moment(values.dates[0]).startOf('weeks')
      queryEndDate = moment(values.dates[1]).endOf('weeks')
    } else if (values.picker_type == 'month') {
      queryStartDate = moment(values.dates[0]).startOf('months')
      queryEndDate = moment(values.dates[1]).endOf('months')
    }

    const { success, result } = await getDashboardOrderSummary({
      brand_id: process.env.NEXT_PUBLIC_KITCHENHUB_BRAND_ID,
      start_date: moment(queryStartDate).format('YYYY-MM-DD'),
      start_time: moment(queryStartDate).format('HH:mm:ss'),
      end_date: moment(queryEndDate).format('YYYY-MM-DD'),
      end_time: moment(queryEndDate).format('HH:mm:ss'),
      date_picker_type: values.picker_type,
    })

    if (success) {
      let { data } = result
      let startDate = values.dates[0]
      let endDate = values.dates[1]

      if (values.picker_type == 'date') {
        startDate = moment(values.dates[0]).startOf('days')
        endDate = moment(values.dates[1]).endOf('days')
        generateChartData(data, startDate, endDate, 'days')
      } else if (values.picker_type == 'week') {
        startDate = moment(values.dates[0]).startOf('weeks')
        endDate = moment(values.dates[1]).endOf('weeks')
        generateChartData(data, startDate, endDate, 'weeks')
      } else if (values.picker_type == 'month') {
        startDate = moment(values.dates[0]).startOf('months')
        endDate = moment(values.dates[1]).endOf('months')
        generateChartData(data, startDate, endDate, 'months')
      }
    } else {
      setChartData([])
    }

    setLoading(false)
  }

  const fetchOrdersCancelSummaryReport = async (values: FormInterFace) => {
    if (size(values.dates) < 2) {
      return
    }
    setLoading(true)

    let queryStartDate = values.dates[0]
    let queryEndDate = values.dates[1]

    if (values.picker_type == 'week') {
      queryStartDate = moment(values.dates[0]).startOf('weeks')
      queryEndDate = moment(values.dates[1]).endOf('weeks')
    } else if (values.picker_type == 'month') {
      queryStartDate = moment(values.dates[0]).startOf('months')
      queryEndDate = moment(values.dates[1]).endOf('months')
    }

    const { success, result } = await getDashboardOrderCancelSummary({
      brand_id: process.env.NEXT_PUBLIC_KITCHENHUB_BRAND_ID,
      start_date: moment(queryStartDate).format('YYYY-MM-DD'),
      start_time: moment(queryStartDate).format('HH:mm:ss'),
      end_date: moment(queryEndDate).format('YYYY-MM-DD'),
      end_time: moment(queryEndDate).format('HH:mm:ss'),
    })
    setLoading(false)

    if (success) {
      let cData: PieDataInterface[] = []
      let cgData: PieDataInterface[] = []
      let { data } = result
      type reasonInterface = {
        reason: string
        count: number
      }

      for (let c of CancelColors) {
        let count = get(
          find(data?.group_by_reason, (o: reasonInterface) => {
            if (has(o, 'reason')) {
              if (o.reason.includes(c.subString)) {
                return o.count
              }
            }
          }),
          'count'
        )
        cData.push({
          y: count || 0,
          name: c.name,
          color: c.color,
        })
      }

      for (let c of CancelGroup) {
        let list = filter(data?.group_by_reason, (o: reasonInterface) => {
          if (has(o, 'reason')) {
            if (c.substringList.some((v) => o.reason.includes(v))) {
              return o.count
            }
          }
        })
        let count = sumBy(list, 'count')
        cgData.push({
          y: count || 0,
          name: c.name,
          color: c.color,
        })
      }
      setCancellationPieData(cData)
      setCancellationGroupPieData(cgData)
    } else {
      setCancellationPieData([])
      setCancellationGroupPieData([])
    }
  }

  const getPercentage = (total: number, target: number) => {
    return numberFormat((target * 100 / total), 2)
  }

  const generateChartData = (
    data: any[],
    startDate: Moment,
    endDate: Moment,
    chartType: 'days' | 'weeks' | 'months'
  ) => {
    let chartData: any[] = []
    let ordersData: AnnotationSeriesData[] = []
    let successData: AnnotationSeriesData[] = []
    let cancelData: AnnotationSeriesData[] = []
    let colLabels: string[] = []
    const sd = new Date(moment(startDate).toDate())
    const ed = new Date(moment(endDate).toDate())
    let totalOrderCount = 0
    let cancelOrderCount: number[] = []

    for (var m = startDate; m.isBefore(endDate); m.add(1, chartType)) {
      let dateData = find(data, { date: m.format('YYYY-MM-DD') })
      if (chartType == 'months') {
        dateData = find(data, { date: m.format('YYYY-MM') })
      } else if (chartType == 'weeks') {
        dateData = find(data, { date: m.startOf('weeks').add(1, 'days').format('YYYY-MM-DD') })
      }

      let colLabel = moment(m).format('DD/MM/YYYY')
      let colId = moment(m).format('DDMMYYYY')
      if (chartType === 'days') {
        colLabel = moment(m).format('DD/MM/YYYY')
        colId = moment(m).format('DDMMYYYY')

      } else if (chartType === 'weeks') {
        colLabel = `${moment(m).startOf('weeks').format('DD/MM')} ~ ${moment(m)
          .endOf('weeks')
          .format('DD/MM')}`
        colId = `${moment(m).startOf('weeks').format('DDMM')}-${moment(m)
          .endOf('weeks')
          .format('DDMM')}`

      } else if (chartType === 'months') {
        colLabel = moment(m).format('MMM YYYY')
        colId = moment(m).format('MMMYYYY')
      }

      colLabels.push(colLabel)

      let totalCount = get(dateData, 'order_total') || 0
      let successCount = get(find(dateData?.group_by_status, { status: 'success' }), 'count') || 0
      let cancelCount = get(find(dateData?.group_by_status, { status: 'cancel' }), 'count') || 0

      ordersData.push({
        y: totalCount,
        id: colId,
      })
      successData.push({
        y: successCount,
        custom_percentage: ` (${getPercentage(totalCount, successCount)}%)`
      })
      cancelData.push({
        y: cancelCount,
        custom_percentage: ` (${getPercentage(totalCount, cancelCount)}%)`
      })
      cancelOrderCount.push(cancelCount)
      totalOrderCount = totalCount
    }

    //Total Order
    chartData.push({
      type: 'column',
      data: ordersData,
      name: 'Order Transactions',
      color: '#93abce',
      borderColor: '#021529',
    })
    //Success
    chartData.push({
      type: 'line',
      data: successData,
      name: 'Success',
      color: '#248423',
    })
    //Cancel
    chartData.push({
      type: 'line',
      data: cancelData,
      name: 'Cancel',
      color: '#fa2b24',
    })

    for (let c of CancelColors) {
      let txData: AnnotationSeriesData[] = generateCancelData(
        data,
        new Date(sd),
        new Date(ed),
        chartType,
        c.subString,
        cancelOrderCount,
      )
      chartData.push({
        type: 'line',
        data: txData,
        name: `เหตุผลที่ยกเลิก - ${c.name}`,
        color: c.color,
        dashStyle: 'shortDash',
        visible: false,
      })
    }

    for (let c of CancelGroup) {
      let txData: AnnotationSeriesData[] = generateCancelGroupData(
        data,
        new Date(sd),
        new Date(ed),
        chartType,
        c.substringList,
        cancelOrderCount
      )
      chartData.push({
        type: 'line',
        data: txData,
        name: `ผู้ที่ทำให้เกิดการยกเลิกออเดอร์: ${c.name}`,
        color: c.color,
        visible: false,
      })
    }

    console.log('chartData', chartData)

    setChartData(chartData)
    setChartxAxis(colLabels)
  }

  const generateCancelData = (
    data: any[],
    startDate: Date,
    endDate: Date,
    chartType: 'days' | 'weeks' | 'months',
    findString: string,
    totalCount: number[]
  ) => {
    let result: AnnotationSeriesData[] = []
    let i = 0;
    for (var md = moment(startDate); md.isBefore(moment(endDate)); md.add(1, chartType)) {
      let dateData = find(data, { date: md.format('YYYY-MM-DD') })
      if (chartType == 'months') {
        dateData = find(data, { date: md.format('YYYY-MM') })
      } else if (chartType == 'weeks') {
        dateData = find(data, { date: md.startOf('weeks').add(1, 'days').format('YYYY-MM-DD') })
      }
      type reasonInterface = {
        reason: string
        count: number
      }
      let count = get(
        find(dateData?.group_by_reason, (o: reasonInterface) => {
          if (has(o, 'reason')) {
            if (o.reason.includes(findString)) {
              return o.count
            }
          }
        }),
        'count'
      )
      result.push({
        y: count || 0,
        custom_percentage: ` (${getPercentage(totalCount[i], count || 0)}%)`
      })
      i++;
    }
    return result
  }

  const generateCancelGroupData = (
    data: any[],
    startDate: Date,
    endDate: Date,
    chartType: 'days' | 'weeks' | 'months',
    findStringList: string[],
    totalCount: number[]
  ) => {
    let result: AnnotationSeriesData[] = []
    let i = 0;
    for (var md = moment(startDate); md.isBefore(moment(endDate)); md.add(1, chartType)) {
      let dateData = find(data, { date: md.format('YYYY-MM-DD') })
      if (chartType == 'months') {
        dateData = find(data, { date: md.format('YYYY-MM') })
      } else if (chartType == 'weeks') {
        dateData = find(data, { date: md.startOf('weeks').add(1, 'days').format('YYYY-MM-DD') })
      }
      type reasonInterface = {
        reason: string
        count: number
      }
      let list = filter(dateData?.group_by_reason, (o: reasonInterface) => {
        if (has(o, 'reason')) {
          if (findStringList.some((v) => o.reason.includes(v))) {
            return o.count
          }
        }
      })
      let count = sumBy(list, 'count')
      result.push({
        y: count || 0,
        custom_percentage: ` (${getPercentage(totalCount[i], count || 0)}%)`
      })
      i++
    }
    return result
  }

  useEffect(() => {
    Highcharts.setOptions({
      lang: {
        decimalPoint: '.',
        thousandsSep: ',',
      },
    })
    fetchOrdersSummaryReport(initialValues)
    fetchOrdersCancelSummaryReport(initialValues)
  }, [])

  const datePickerFormat: DatePickerProps['format'] = (value) => {
    const picker_type = formik.values.picker_type

    if (picker_type === 'date') {
      return moment(value).format('YYYY-MM-DD HH:mm')
    } else if (picker_type === 'week') {
      const weekFormat = 'YYYY-MM-DD'
      return `${moment(value).startOf('week').format(weekFormat)} ~ ${moment(value)
        .endOf('week')
        .format(weekFormat)}`
    } else if (picker_type == 'month') {
      return moment(value).format('YYYY-MM')
    } else {
      return moment(value).format('YYYY-MM-DD HH:mm')
    }
  }

  return (
    <MainLayout>
      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 40 }}>
          <Col span={24}>
            <Title level={4}>ช่วงเวลา *</Title>
          </Col>
          <Col span={24}>
            <Radio.Group
              value={formik.values.picker_type}
              onChange={(e: any) => {
                let picker_type = e?.target?.value
                formik.setFieldValue('picker_type', picker_type)
                if (picker_type === 'date') {
                  formik.setFieldValue('dates', defaultSelDate)
                } else if (picker_type === 'week') {
                  formik.setFieldValue('dates', defaultSelWeek)
                } else if (picker_type === 'month') {
                  formik.setFieldValue('dates', defaultSelMonth)
                }
              }}
            >
              <Radio.Button value="date">รายวัน</Radio.Button>
              <Radio.Button value="week">รายสัปดาห์</Radio.Button>
              <Radio.Button value="month">รายเดือน</Radio.Button>
            </Radio.Group>
          </Col>
          <Col span={24}>
            <RangePicker
              value={formik.values.dates}
              onChange={(val: any) => {
                formik.setFieldValue('dates', val)
              }}
              showTime={formik.values.picker_type == 'date' ? { format: 'HH:mm' } : false}
              picker={formik.values.picker_type}
              format={datePickerFormat}
            />
            <Button type="primary" onClick={handleSubmit} style={{ marginLeft: 20 }}>
              {' '}
              ค้นหา{' '}
            </Button>
            <div>
              <Text type="danger">{formik.errors.dates}</Text>
            </div>
          </Col>
        </Row>

        <Spin spinning={loading}>
          <Row gutter={16}>
            <Col span={24}>
              {!loading &&
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      height: 650,
                    },
                    title: {
                      text: '',
                    },
                    lang: {
                      thousandsSep: ',',
                    },
                    // plotOptions: {
                    //   series: {
                    //     marker: {
                    //       enabled: false,
                    //     },
                    //   },
                    // },
                    legend: {
                      //   layout: 'vertical',
                      //   verticalAlign: 'middle',
                      //   align: 'right',
                      //   floating: false,
                      itemMarginTop: 3,
                      itemMarginBottom: 3,
                    },
                    yAxis: {
                      title: {
                        text: 'จำนวนออเดอร์',
                      },
                    },
                    xAxis: {
                      categories: chartxAxis,
                    },
                    tooltip: {
                      pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y}{point.custom_percentage}</b><br/>',
                      crosshairs: [true, true],
                      shared: true
                    },
                    series: chartData,
                    // annotations: [{
                    //   labels: [{
                    //     useHTML: true,
                    //     point: "15/06/2022",
                    //     text: '15/06/2022<br/>1. แคมเปญค่าส่ง 0 บาท<br/>2.Test new Line'
                    //   }]
                    // }]
                  }}
                />
              }
              {loading && <div style={{ minHeight: 300 }}></div>}
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col span={24}>
              <Title level={4}>สาเหตุยกเลิกออเดอร์</Title>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie',
                  },
                  plotOptions: {
                    pie: {
                      allowPointSelect: true,
                      cursor: 'pointer',
                      dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.2f} %',
                      },
                    },
                  },
                  tooltip: {
                    pointFormat: '<b>{point.y:,.0f} Orders ({point.percentage:.2f}%)</b>',
                    shared: true,
                    useHTML: true,
                  },
                  title: {
                    text: 'สัดส่วนเหตุผลยกเลิกออเดอร์',
                  },
                  series: [
                    {
                      type: 'pie',
                      data: cancellationPieData,
                      name: '',
                    },
                  ],
                }}
              />
            </Col>
            <Col span={12}>
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie',
                  },
                  plotOptions: {
                    pie: {
                      allowPointSelect: true,
                      cursor: 'pointer',
                      dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.2f} %',
                      },
                    },
                  },
                  tooltip: {
                    pointFormat: '<b>{point.y:,.0f} Orders ({point.percentage:.2f}%)</b>',
                    shared: true,
                    useHTML: true,
                  },
                  title: {
                    text: 'สัดส่วนผู้ที่ทำให้เกิดยกเลิกออเดอร์',
                  },
                  series: [
                    {
                      data: cancellationGroupPieData,
                      name: '',
                    },
                  ],
                }}
              />
            </Col>
          </Row>
        </Spin>
      </Card>
    </MainLayout>
  )
}

export default Home
