var pg = require("pg");
const fs = require('fs');
const path = require('path');
var shell = require('shelljs');
const xml = require("xml");
// import { cdnPath, newCdnPath, archievePath, dumpCdnPath} from "./imported.js";
var sourceFile = require("./sourceFiles.js");

var connectionString = {
  user: 'adserver_master',
  host: 'adserver-db.c39logbtfzjv.us-west-2.rds.amazonaws.com',
  database: 'adserver_db',
  password: 's)A5^Z1$)QhESt#q',
  port: 5432
};

var pool = new pg.Pool(connectionString);
let arr = [];

pool.connect(async function (err, client, done) {
    if(err){
    console.log('Error:',err);
    }
        const query = client.query(new pg.Query("SELECT * from flights INNER JOIN video_creatives ON flights.id = video_creatives.flight_id"))
        query.on('row', async (row) => {
             //console.log(row);
            if (row.demand_source_type == 'first_party' && row.format =='video') {
                console.log('============= VAST DOCUMENT ===================');
            //   console.log(row);
           let newVast =   await generateVastDocument(row, row.advertiser_id)
             const queryVast =  await  client.query(new pg.Query(`UPDATE flights SET vast_document_temp ='${newVast}' WHERE id =${row.flight_id}`))
              queryVast.on('row', async (row) => {
                    console.log('Successfully inserted new vast Doc');
                })
                queryVast.on('end',  (res) => {
                    console.log("ending vast Doc");
            
                })
                queryVast.on('error', (res) => {
                    console.log('VAST DOC ERROR:', res);
                })

              
            }

            if (row.demand_source_type == 'first_party' && row.format =='video') {
                console.log('============= WRAPPER VAST ===================');
                // console.log(row);
                let newWrapper =  generateWrapperVast( row, row.account_id, row.advertiser_id )

                const queryWrapper =  await  client.query(new pg.Query(`UPDATE flights SET wrapper_vast_temp ='${newWrapper}' WHERE id =${row.flight_id}`))
                queryWrapper.on('row', (row) => {
                       console.log('Successfully inserted new Wrapper Vast');
                   })
                   queryWrapper.on('end',  (res) => {
                       console.log("ending Wrapper Vast");
               
                   })
                   queryWrapper.on('error', (res) => {
                       console.log('Wrapper Vast ERROR:', res);
                   })
                
              }
        })
        query.on('end',  (res) => {
            // pool shutdown console.log("ending");
            console.log("ending", arr);
            // pool.end()
            })
            query.on('error', (res) => {
                console.log(res);
            })

            // done()
        })

        
        async function generateVastDocument(data, advertiser_id) {
            // console.log('DATA = ', data); 
            const isSkippable = data.is_skippable == 'none'? '00:00:00':data.is_skippable == '5 Seconds'?'00:00:05':'00:00:15';

            creativeDomain = `https://video.pilotx.tv/${data.id}`;

            if (data.format === "video") {
              const obj = {};
          
              if (
                data.demand_source_type === "first_party" &&
                data.is_vast_only
              ) {
                obj.VAST = [
                  {
                    _attr: {
                      version: "3.0"
                    }
                  },
                  {
                    Ad: [
                      {
                        _attr: {
                          id: `${data.id}${data.campaign_id}`
                        }
                      },
                      {
                        InLine: [
                          {
                            AdSystem: [
                              {
                                _attr: {
                                  version: "1.0"
                                }
                              },
                              "PILOTX"
                            ]
                          },
                          {
                            AdTitle: "BWAWF"
                          },
                          {
                            Survey: {
                              _cdata: "{ADSERVER}/surv?{PARAMS}"
                            }
                          },
                          {
                            Advertiser: advertiser_id
                          },
                          {
                            Error: {
                              _cdata: "{ADSERVER}//err?err=[ERRORCODE]&{PARAMS}"
                            }
                          },
                          {
                            Impression: {
                              _cdata: "{ADSERVER}/imp?{PARAMS}"
                            }
                          },
                          {
                            Creatives: [
                              {
                                Creative: [
                                  {
                                    Linear: [
                                      isSkippable !=='00:00:00' ?{
                                        _attr: {
                                          skipoffset:`${isSkippable}`
                                        }
                                      }:'',
                                      {
                                        AdParameters: {
                                          _cdata: ""
                                        }
                                      },
                                      {
                                        Duration: {
                                          _cdata: `00:00:${data.duration}`
                                        }
                                      },
                                      {
                                        MediaFiles: [
                                          {
                                            MediaFile: {
                                              _attr: {
                                                id: `${data.id}`,
                                                delivery: "progressive",
                                                type: `video/mp4`,
                                                width: `${data.width}`,
                                                height: `${data.height}`,
                                                bitrate: `${data.bitrate}`
                                              },
                                              _cdata: `${creativeDomain}/${
                                                data.filename.split(".")[0]}.mp4`
                                            }
                                          },
                                          {
                                            MediaFile: {
                                              _attr: {
                                                id: `${data.id}`,
                                                delivery: "progressive",
                                                type: `video/webm`,
                                                width: `${data.width}`,
                                                height: `${data.height}`,
                                                bitrate: `${data.bitrate}`
                                              },
                                              _cdata: `${creativeDomain}/${
                                                data.filename.split(".")[0]}.webm`
                                            }
                                          }
                                        ]
                                      },
                                    data.channel !=='desktop'?  {
                                        Extensions: [
                                      {
                                        Extension: [
                                      
                                      {
                                        CustomTracking: [
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "skip"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=skip&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "engagedView"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=engagedView&{PARAMS}"
                                            }
                                          }
          
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              } :     {
                                Extensions: {
                                  _cdata: ""
                                }
                              },
                                      {
                                        TrackingEvents: [
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "creativeView"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=creativeView&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "skip"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=skip&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "start"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=start&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "firstQuartile"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=firstQuartile&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "midpoint"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=midpoint&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "thirdQuartile"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=thirdQuartile&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "complete"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=complete&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "mute"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=mute&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "unmute"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=unmute&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "pause"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=pause&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "rewind"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=rewind&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "resume"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=resume&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "fullscreen"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=fullscreen&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "exitFullscreen"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=exitFullScreen&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "expand"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=expand&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "collapse"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=collapse&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "acceptInvitation"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=acceptInvitation&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "close"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=close&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "progress"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=progress&{PARAMS}"
                                            }
                                          }
                                        ]
                                      },
                                      {
                                        VideoClicks: [
                                          {
                                            ClickThrough: {
                                              _cdata: data.clickthrough_url
                                            }
                                          },
                                          {
                                            ClickTracking: {
                                              _cdata: "{ADSERVER}/ev?event=click&{PARAMS}"
                                            }
                                          },
                                          {
                                            ClickTracking: {
                                              _cdata: data.click_tracker
                                            }
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ];
              }
              //new for vast_only RTB
              else if (
                data.demand_source_type === "rtb" &&
                data.is_vast_only
              ) {
                obj.VAST = [
                  {
                    _attr: {
                      version: "3.0"
                    }
                  },
                  {
                    Ad: [
                      {
                        _attr: {
                          id: `${data.id}${data.campaign_id}`
                        }
                      },
                      {
                        Wrapper: [
                          {
                            AdSystem: [
                              {
                                _attr: {
                                  version: "1.0"
                                }
                              },
                              "PILOTX"
                            ]
                          },
                          {
                            VASTAdTagURI: {
                              _cdata: "{ADSERVER}/rtb?{PARAMS}"
                            }
                          },
                          {
                            Error: {
                              _cdata: "{ADSERVER}/err?{PARAMS}"
                            }
                          },
                          {
                            Impression: {
                              _cdata: "{ADSERVER}/imp?{PARAMS}"
                            }
                          },
                          {
                            Creatives: [
                              {
                                Creative: [
                                  {
                                    Linear: [
                                      {
                                        TrackingEvents: [
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "creativeView"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=creativeView&{PARAMS}"
                                            }
                                          },
          
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "skip"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=skip&{PARAMS}"
                                            }
                                          },
          
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "start"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=start&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "firstQuartile"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=firstQuartile&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "midpoint"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=midpoint&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "thirdQuartile"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=thirdQuartile&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "complete"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=complete&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "mute"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=mute&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "unmute"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=unmute&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "pause"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=pause&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "rewind"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=rewind&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "resume"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=resume&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "fullscreen"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=fullscreen&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "exitFullscreen"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=exitFullScreen&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "expand"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=expand&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "collapse"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=collapse&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "acceptInvitation"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=acceptInvitation&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "close"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=close&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "progress"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=progress&{PARAMS}"
                                            }
                                          }
                                        ]
                                      },
                                      {
                                        VideoClicks: [
                                          {
                                            ClickTracking: {
                                              _cdata: "{ADSERVER}/ev?event=click&{PARAMS}"
                                            }
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ];
              } else if (
                data.demand_source_type === "third_party" &&
                data.is_vast_only
              ) {
                obj.VAST = [
                  {
                    _attr: {
                      version: "3.0"
                    }
                  },
                  {
                    Ad: [
                      {
                        _attr: {
                          id: `${data.id}${data.campaign_id}`
                        }
                      },
                      {
                        Wrapper: [
                          {
                            AdSystem: [
                              {
                                _attr: {
                                  version: "1.0"
                                }
                              },
                              "PILOTX"
                            ]
                          },
                          {
                            VASTAdTagURI: {
                              _cdata: `${data.js_tag}`
                            }
                          },
                          {
                            Error: {
                              _cdata: "{ADSERVER}//err?err=[ERRORCODE]&{PARAMS}"
                            }
                          },
                          {
                            Impression: {
                              _cdata: "{ADSERVER}/imp?{PARAMS}"
                            }
                          },
                          {
                            Creatives: [
                              {
                                Creative: [
                                  {
                                    Linear: [
                                      isSkippable !=='00:00:00' ?{
                                        _attr: {
                                          skipoffset:`${isSkippable}`
                                        }
                                      }:'', 
                                      {
                                        TrackingEvents: [
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "creativeView"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=creativeView&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "skip"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=skip&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "start"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=start&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "firstQuartile"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=firstQuartile&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "midpoint"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=midpoint&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "thirdQuartile"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=thirdQuartile&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "complete"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=complete&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "mute"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=mute&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "unmute"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=unmute&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "pause"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=pause&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "rewind"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=rewind&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "resume"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=resume&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "fullscreen"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=fullscreen&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "exitFullscreen"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=exitFullScreen&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "expand"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=expand&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "collapse"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=collapse&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "acceptInvitation"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=acceptInvitation&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "close"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=close&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "progress"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=progress&{PARAMS}"
                                            }
                                          }
                                        ]
                                      },
                                      {
                                        VideoClicks: [
                                          {
                                            ClickTracking: {
                                              _cdata: "{ADSERVER}/ev?event=click&{PARAMS}"
                                            }
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ];
              } else if (
                data.demand_source_type === "first_party" &&
                !data.is_vast_only
              ) {
                obj.VAST = [
                  {
                    _attr: {
                      version: "3.0"
                    }
                  },
                  {
                    Ad: [
                      {
                        _attr: {
                          id: `${data.id}${data.campaign_id}`
                        }
                      },
                      {
                        InLine: [
                          {
                            AdSystem: [
                              {
                                _attr: {
                                  version: "1.0"
                                }
                              },
                              "PILOTX"
                            ]
                          },
                          {
                            AdTitle: "BWAWF"
                          },
                          {
                            Survey: {
                              _cdata: "{ADSERVER}/surv?{PARAMS}"
                            }
                          },
                          {
                            Advertiser: advertiser_id
                          },
                          {
                            Error: {
                              _cdata: "{ADSERVER}//err?err=[ERRORCODE]&{PARAMS}"
                            }
                          },
                          {
                            Impression: {
                              _cdata: "{ADSERVER}/imp?{PARAMS}"
                            }
                          },
                          {
                            Creatives: [
                              {
                                Creative: [
                                  {
                                    Linear: [
                                      isSkippable !=='00:00:00' ?{
                                        _attr: {
                                          skipoffset:`${isSkippable}`
                                        }
                                      }:'',       
                                      {
                                        AdParameters: {
                                          _cdata: JSON.stringify({
                                            vid: {
                                              url: `${creativeDomain}/${data.filename}`,
                                              mimetype: data.content_type,
                                              width: data.width.toString(),
                                              height: data.height.toString(),
                                              bitrate: data.bitrate.toString(),
                                              duration: data.duration.toString()
          
                                            }
                                          })
                                        }
          
                                      },
                                      {
                                        Duration: {
                                          _cdata: `00:00:${data.duration}`
                                        }
                                      },
                                      {
                                        MediaFiles: [
                                          {
                                            MediaFile: {
                                              _attr: {
                                                id: `0`,
                                                delivery: "progressive",
                                                type: `application/javascript`,
                                                width: `${data.width}`,
                                                height: `${data.height}`,
                                                apiFramework: "VPAID"
                                              },
                                              _cdata:
                                                process.env.NODE_ENV == "development" ||
                                                !process.env.NODE_ENV
                                                  ? `http://www.bwatest.com/vpaid.js`
                                                  : `https://cdn.pilotx.tv/vpaid.js`
                                            }
                                          }
                                        ]
                                      },
                                      data.channel !=='desktop' ?       {
                                        Extensions: [
                                      {
                                        Extension: [
                                      
                                      {
                                        CustomTracking: [
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "skip"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=skip&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "engagedView"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=engagedView&{PARAMS}"
                                            }
                                          }
          
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }: {
                                Extensions: {
                                  _cdata: ""
                                }
                              },
                                      {
                                        TrackingEvents: [
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "creativeView"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=creativeView&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "skip"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=skip&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "start"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=start&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "firstQuartile"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=firstQuartile&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "midpoint"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=midpoint&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "thirdQuartile"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=thirdQuartile&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "complete"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=complete&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "mute"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=mute&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "unmute"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=unmute&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "pause"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=pause&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "rewind"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=rewind&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "resume"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=resume&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "fullscreen"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=fullscreen&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "exitFullscreen"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=exitFullScreen&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "expand"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=expand&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "collapse"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=collapse&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "acceptInvitation"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=acceptInvitation&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "close"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=close&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "progress"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=progress&{PARAMS}"
                                            }
                                          }
                                        ]
                                      },
                                      {
                                        VideoClicks: [
                                          {
                                            ClickThrough: {
                                              _cdata: data.clickthrough_url
                                            }
                                          },
                                          {
                                            ClickTracking: {
                                              _cdata: "{ADSERVER}/ev?event=click&{PARAMS}"
                                            }
                                          },
                                          {
                                            ClickTracking: {
                                              _cdata: data.click_tracker
                                            }
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                          
                        ]
                      }
                    ]
                  }
                ];
              } else if (
                (data.demand_source_type === "third_party" ||
                  data.demand_source_type === "rtb") &&
                !data.is_vast_only
              ) {
                var vast_tag_url;
                if (data.demand_source_type === "rtb") {
                  // tagURL =  '{ADSERVER}/rtb?{PARAMS}';
                  vast_tag_url = "{ADSERVER}/rtb?{PARAMS}";
                } else {
                  // tagURL =  `${data.js_tag}`;
                  vast_tag_url = `${data.js_tag}`;
                }
          
                obj.VAST = [
                  {
                    _attr: {
                      version: "3.0"
                    }
                  },
                  {
                    Ad: [
                      {
                        _attr: {
                          id: `${data.id}${data.campaign_id}`
                        }
                      },
                      {
                        Wrapper: [
                          {
                            AdSystem: [
                              {
                                _attr: {
                                  version: "1.0"
                                }
                              },
                              "PILOTX"
                            ]
                          },
                          {
                            VASTAdTagURI: {
                              _cdata: vast_tag_url
                            }
                          },
                          {
                            Error: {
                              _cdata: "{ADSERVER}//err?err=[ERRORCODE]&{PARAMS}"
                            }
                          },
                          {
                            Impression: {
                              _cdata: "{ADSERVER}/imp?{PARAMS}"
                            }
                          },
                          {
                            Creatives: [
                              {
                                Creative: [
                                  {
                                    Linear: [
                                      isSkippable !=='00:00:00' ?{
                                        _attr: {
                                          skipoffset:`${isSkippable}`
                                        }
                                      }:'',
                                      {
                                        TrackingEvents: [
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "creativeView"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=creativeView&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "skip"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=skip&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "start"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=start&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "firstQuartile"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=firstQuartile&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "midpoint"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=midpoint&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "thirdQuartile"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=thirdQuartile&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "complete"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=complete&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "mute"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=mute&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "unmute"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=unmute&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "pause"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=pause&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "rewind"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=rewind&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "resume"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=resume&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "fullscreen"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=fullscreen&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "exitFullscreen"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=exitFullScreen&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "expand"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=expand&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "collapse"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=collapse&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "acceptInvitation"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=acceptInvitation&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "close"
                                              },
                                              _cdata: "{ADSERVER}/ev?event=close&{PARAMS}"
                                            }
                                          },
                                          {
                                            Tracking: {
                                              _attr: {
                                                event: "progress"
                                              },
                                              _cdata:
                                                "{ADSERVER}/ev?event=progress&{PARAMS}"
                                            }
                                          }
                                        ]
                                      },
                                      {
                                        VideoClicks: [
                                          {
                                            ClickThrough: {
                                              _cdata: data.clickthrough_url
                                            }
                                          },
                                          {
                                            ClickTracking: {
                                              _cdata: "{ADSERVER}/ev?event=click&{PARAMS}"
                                            }
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ];
              }
          
              const generatedXML = xml(obj);
              // console.log("Generated xml", generatedXML.toString())
              return generatedXML.toString();
            } else {
              return "";
            }
          }


          function generateWrapperVast(data, daid, adid) {

            let creativeDomain = `https://video.pilotx.tv/${data.id}`;

            if (data.format === "video") {
              const obj = {
                fdata: "{FDATA}",
                fid: "{FID}",
                muted: data.is_muted_allowed.toString(),
                vw: data.is_visible_only.toString(),
                vs: data.is_visible_only.toString(),
                ps: data.player_size,
                click: data.clickthrough_url,
                // New fields below
                crid: "{CREATIVEID}",
                adid: adid.toString(),
                campaignid: data.campaign_id.toString(),
                exid: "{EXCHANGEID}",
                buytype: "{BUYTYPE}",
                bundleid: "{BUNDLEID}",
                mediatype: "{MEDIATYPE}"
              };
          
              if (data.demand_source_type === "first_party") {
                obj.vid = {
                  url: `${creativeDomain}/${data.filename}`,
                  mimetype: data.content_type,
                  width: data.width.toString(),
                  height: data.height.toString(),
                  bitrate: data.bitrate.toString(),
                  duration: data.duration.toString()
                };
              } else if (data.demand_source_type === "third_party") {
                obj.url = data.js_tag;
              } else if (data.demand_source_type === "rtb") {
                obj.rtb = "1";
                obj.url = "{ADSERVER}/rtb?{PARAMS}";
              }
          
              return JSON.stringify(obj);
            } else {
              return "";
            }
          }