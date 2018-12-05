import axios from 'axios';
import {
  CHANGE_DASHBOARD_STATE,
  DASHBOARD_TABLE,
  DASHBOARD_KPI,
  DASHBOARD_SUMMARY,
  DASHBOARD_PERFORMANCE,
  DASHBOARD_FINANCIALS,
  DASHBOARD_DOMAINS,
  DASHBOARD_REACH,
  DASHBOARD_TRAFFIC,
  DASHBOARD_TOP_ADVERTISER,
DASHBOARD_TABLE_TOP_PUBLISHER
} from './types';
import { ANALYTICS_URL } from "../../vars";

function extractHostname(url) {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("://") > -1) {
    hostname = url.split('/')[2];
  }
  else {
    hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
}

function extractRootDomain(url) {
  var domain = extractHostname(url), splitArr = domain.split('.'), arrLen = splitArr.length;
  //extracting the root domain here
  //if there is a subdomain 
  if (arrLen > 2) {
    domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
    //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
    if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
      //this is using a ccTLD
      domain = splitArr[arrLen - 3] + '.' + domain;
    }
  }
  return domain;
}


export const changeDashboardState = ({ prop, value }) => dispatch => {
  dispatch({ type: CHANGE_DASHBOARD_STATE, prop, value });
};

export const fetchDashboardTableData = data => dispatch => {
  axios.post(`${ANALYTICS_URL}/api/reports/dashboards/heads_up_table/`, data, {
    headers: { Authorization: `JWT ${localStorage.getItem('token')}` }
  })
    .then(response => {
      dispatch({ type: DASHBOARD_TABLE, payload: response.data.results });
    })
    .catch(err => {
      // console.log(err);
    })
};

export const fetchDashboardTopAdvertiser = data => dispatch => {
  axios.post(`${ANALYTICS_URL}/api/reports/dashboards/heads_up_table/`, data, {
    headers: { Authorization: `JWT ${localStorage.getItem('token')}` }
  })
    .then(response => {
      dispatch({ type: DASHBOARD_TOP_ADVERTISER, payload: response.data.results });
    })
    .catch(err => {
      // console.log(err);
    })
};


export const fetchDashboardTopPublisher = data => dispatch => {
  axios.post(`${ANALYTICS_URL}/api/reports/dashboards/heads_up_table/`, data, {
    headers: { Authorization: `JWT ${localStorage.getItem('token')}` }
  })
    .then(response => {
      dispatch({ type: DASHBOARD_TABLE_TOP_PUBLISHER, payload: response.data.results });
    })
    .catch(err => {
      // console.log(err);
    })
};

export const fetchDashboardKPI = data => dispatch => {
  axios.post(`${ANALYTICS_URL}/api/reports/dashboards/kpi_table/`, data, {
    headers: { Authorization: `JWT ${localStorage.getItem('token')}` }
  })
    .then(response => {
      dispatch({ type: DASHBOARD_KPI, payload: response.data.results });
    })
};

export const fetchDashboardSummary = data => dispatch => {
  axios.post(`${ANALYTICS_URL}/api/reports/dashboards/top_level_summary/`, data, {
    headers: { Authorization: `JWT ${localStorage.getItem('token')}` }
  })
    .then(response => {
      dispatch({ type: DASHBOARD_SUMMARY, payload: response.data.results });
    })
};

export const fetchDashboardPerformance = data => dispatch => {
  axios.post(`${ANALYTICS_URL}/api/reports/dashboards/performance_graph/`, data, {
    headers: { Authorization: `JWT ${localStorage.getItem('token')}` }
  })
    .then(response => {
      dispatch({ type: DASHBOARD_PERFORMANCE, payload: performanceChart(response.data.results) });
    })
};

export const fetchDashboardFinancials = data => dispatch => {
  axios.post(`${ANALYTICS_URL}/api/reports/dashboards/financial_graph/`, data, {
    headers: { Authorization: `JWT ${localStorage.getItem('token')}` }
  })
    .then(response => {
      dispatch({ type: DASHBOARD_FINANCIALS, payload: financialsChart(response.data.results) });
    })
};

export const fetchDashboardDomains = data => dispatch => {
  axios.post(`${ANALYTICS_URL}/api/reports/dashboards/top_filling_domains/`, data, {
    headers: { Authorization: `JWT ${localStorage.getItem('token')}` }
  })
    .then(response => {
      response.data.results.map((val, index) => {
        // val.full_domain = val.domain;
        let urlHost = extractRootDomain(val.domain);
        val.domain = urlHost;
      })
     

      dispatch({ type: DASHBOARD_DOMAINS, payload: domainsChart(response.data.results) });
    })
};

export const fetchDashboardReach = data => dispatch => {
  axios.post(`${ANALYTICS_URL}/api/reports/dashboards/geo_reach/`, data, {
    headers: { Authorization: `JWT ${localStorage.getItem('token')}` }
  })
    .then(response => {
      dispatch({ type: DASHBOARD_REACH, payload: reachChart(response.data.results) });
    })
    .catch(err => {
      console.log(err);
    })
};

export const fetchDashboardTraffic = data => dispatch => {
  axios.post(`${ANALYTICS_URL}/api/reports/dashboards/platform_reach/`, data, {
    headers: { Authorization: `JWT ${localStorage.getItem('token')}` }
  })
    .then(response => {
      dispatch({ type: DASHBOARD_TRAFFIC, payload: trafficChart(response.data.results) });
    })
};

const performanceChart = data => {
  let payload = [];
  for (let index = 0; index < data.length; index++) {
      let obj = {
        cateories: data[index].date,
        opp: Number(data[index].opportunities),
        imp: Number(data[index].impressions),
        rev: Number(data[index].revenue)
      }
    payload.push(obj);
    }
   return payload;


};

const financialsChart = data => {
  const options = {
    chart: {
      zoomType: 'xy'
    },
    credits: {
      enabled: false
    },
    title: {
      text: ""
    },
    legend: {
      enabled: false
    },
    xAxis: [
      {
        categories: [],
        crosshair: true,
        visible: false
      }
    ],
    yAxis: [
      {
        title: {
          text: 'Revenue'
        },
        gridLineWidth: 0,
        visible: false
      }
    ],
    tooltip: {
      shared: true
    },
    series: [
      {
        name: 'Revenue',
        type: 'areaspline',
        yAxis: 0,
        data: [],
        marker: {
          enabled: false
        },
        lineWidth: 0,
        fillColor: 'rgba(187, 222, 251, 0.5)',
        lineColor: 'rgba(187, 222, 251, 0.5)'
      }
    ]
  };
  let revenue = 0;
  let payout = 0;

  data.forEach(item => {
    options.xAxis[0].categories.push(item.date);
    options.series[0].data.push(Number(item.revenue));
    revenue += Number(item.revenue);
    payout += Number(item.payout);
  });
  const cost = (payout / revenue * 100);
  const margin = ((revenue - payout) / revenue * 100);
  const marginOptions = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false
    },
    subtitle: {
      text: `${margin.toFixed(0)}%`,
      align: 'center',
      verticalAlign: 'middle',
      style: {
        fontSize: '10px'
      },
      y: 5
    },
    title: {
      text: 'MARGIN',
      align: 'center',
      verticalAlign: 'bottom',
      style: {
        fontSize: '10px'
      }
    },
    tooltip: {
      enabled: false
      // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: false,
        }
      }
    },
    series: [{
      type: 'pie',
      name: 'Browser share',
      innerSize: '75%',
      data: [margin, 100 - margin]
    }]
  };

  const costOptions = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false
    },
    subtitle: {
      text: `${cost.toFixed(0)}%`,
      align: 'center',
      verticalAlign: 'middle',
      style: {
        fontSize: '10px'
      },
      y: 5
    },
    title: {
      text: 'COSTS',
      align: 'center',
      verticalAlign: 'bottom',
      style: {
        fontSize: '10px'
      }
    },
    tooltip: {
      enabled: false
      // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: false,
        }
      }
    },
    series: [{
      type: 'pie',
      name: 'Browser share',
      innerSize: '75%',
      data: [cost, 100 - cost]
    }]
  };

  return {
    options,
    costOptions,
    marginOptions
  }
};

const domainsChart = data => {
  let payload = [];
  for (let index = 0; index < data.length; index++) {
    let obj = {
      opp: Number(data[index].opportunities),
      imp: Number(data[index].impressions),
      name: data[index].domain,
      uv: Number((Number(data[index].fill_rate) * 100).toFixed(2)),
    }
    payload.push(obj);
  }
  return payload;
;
};

const reachChart = data => {

  const total = data.reduce(function (prev, cur) {
    return prev + cur.opportunities;
  }, 0);
  
  let payload = [];
  for (let index = 0; index < data.length; index++) {
    let obj = {
      code: data[index].country,
      value: data[index].opportunities,
      totalImp: total
    }
    payload.push(obj);
  }
  return payload;

};

const trafficChart = data => {
  var total = data.reduce(function (prev, cur) {
    return prev + cur.opportunities;
  }, 0);
  let payload = { data:[], total};

  let mobile = 0;
  let desktop = 0;
  let ctv = 0;
  let other = 0;

  data.forEach(item => {
    switch (item.user_platform_category) {
      case 'android':
      case 'ios':
      case 'mobile_other':
      case 'windows_mobile':
        mobile += item.opportunities;
        break;
      case 'ctv':
        ctv += item.opportunities;
        break;
      case 'desktop':
        desktop += item.opportunities;
        break;
      case 'other':
        other += item.opportunities;
        break;
    }
  });

  payload.data.push({
    name: 'Mobile',
    value: mobile,
    fill : '#4ce1b6'
  });
  payload.data.push({
    name: 'CTV',
    value: ctv,
    fill :'#70bbfd'
  });
  payload.data.push({
    name: 'Desktop',
    value: desktop,
    fill : '#f6da6e' 
   });
  payload.data.push({
    name: 'Other',
    value: other,
    fill :'#ff4861'
  });
  payload.total=total;

  return payload;
};
