var demo_tasks = {
	data:[
			{id:1, text:"Project #1",start_date:"01-10-2016", duration:4,
			progress: 0.6, color:"red", progressColor:"green"},
			{id:2, text:"Task #1",   start_date:"02-10-2016", duration:2,
			progress: 1},
			{id:3, text:"Task #2",   start_date:"02-10-2016", duration:17,
			progress: 0.5, open: true},
			{id:4, text:"Task #2.1", start_date:"03-10-2016", duration:2,
			progress: 1,   open: true},
			{id:5, text:"Task #2.2", start_date:"04-10-2016", duration:3,
			progress: 0.8, open: true},
			{id:6, text:"Task #2.3", start_date:"05-10-2016", duration:4,
			progress: 0.2, open: true}
	]
};

var users_data = {
"data":[{"duration": 10, "progressColor": "green", "start_date": "01-09-2016", "progress": 1, "text": "CLOSED", "name": "<a href='/schedule/task_view?id=21'>test android</a>", "to": "13-09-2016", "desc": "worker celera", "color": "red", "id": 21}, {"duration": 10, "progressColor": "green", "start_date": "06-09-2016", "progress": 1, "text": "CLOSED", "values": [{"from": "/Date(1473120000000.0)/", "label": "CLOSED/ OVERDUE", "customClass": "ganttGray", "to": "/Date(1473379200000.0)/"}, {"from": "/Date(1473379200000.0)/", "label": "", "customClass": "ganttRed", "to": "/Date(1474458185673.817)/"}], "name": "<a href='/schedule/task_view?id=22'>awd</a>", "to": "2016-09-21 11:43:05.673817+00:00", "desc": "", "color": "red", "id": 22}, {"duration": 10, "progressColor": "green", "start_date": "31-08-2016", "progress": 1, "text": "NEW", "values": [{"from": "/Date(1472601600000.0)/", "label": "NEW/ OVERDUE", "customClass": "ganttBlue", "to": "/Date(1472774400000.0)/"}, {"from": "/Date(1472774400000.0)/", "label": "", "customClass": "ganttRed", "to": "/Date(1476173591208.53)/"}], "name": "<a href='/schedule/task_view?id=32'>awd</a>", "to": "2016-10-11 08:13:11.208530+00:00", "desc": "man2 ger2", "color": "red", "id": 32}, {"duration": 10, "progressColor": "green", "start_date": "13-09-2016", "progress": 1, "text": "PROCESSING", "values": [{"from": "/Date(1473724800000.0)/", "label": "PROCESSING/ OVERDUE", "customClass": "ganttOrange", "to": "/Date(1475280000000.0)/"}, {"from": "/Date(1475280000000.0)/", "label": "", "customClass": "ganttRed", "to": "/Date(1476173591211.525)/"}], "name": "<a href='/schedule/task_view?id=31'>adaw</a>", "to": "2016-10-11 08:13:11.211525+00:00", "desc": "Maneger wdawd, worker celera", "color": "red", "id": 31}, {"duration": 10, "progressColor": "green", "start_date": "01-10-2016", "progress": 1, "text": "PROCESSING", "values": [{"from": "/Date(1475280000000.0)/", "label": "PROCESSING", "customClass": "ganttOrange", "to": "/Date(1476173591214.686)/"}, {"from": "/Date(1476173591214.686)/", "label": "", "customClass": "ganttBlank", "to": "/Date(1477958400000.0)/"}], "name": "<a href='/schedule/task_view?id=34'>test</a>", "to": "2016-11-01 00:00:00+00:00", "desc": "vadum polovjuk, worker celera", "color": "red", "id": 34}, {"duration": 10, "progressColor": "green", "start_date": "02-09-2016", "progress": 1, "text": "CLOSED", "values": [{"from": "/Date(1472796000000.0)/", "label": "CLOSED/ OVERDUE", "customClass": "ganttGray", "to": "/Date(1473019200000.0)/"}, {"from": "/Date(1473019200000.0)/", "label": "", "customClass": "ganttRed", "to": "/Date(1474528312447.946)/"}], "name": "<a href='/schedule/task_view?id=33'>TEST task</a>", "to": "2016-09-22 07:11:52.447946+00:00", "desc": "", "color": "red", "id": 33}, {"duration": 10, "progressColor": "green", "start_date": "08-09-2016", "progress": 1, "text": "NEW", "values": [{"from": "/Date(1473292800000.0)/", "label": "NEW/ OVERDUE", "customClass": "ganttBlue", "to": "/Date(1473552000000.0)/"}, {"from": "/Date(1473552000000.0)/", "label": "", "customClass": "ganttRed", "to": "/Date(1476173591221.6812)/"}], "name": "<a href='/schedule/task_view?id=24'>tes</a>", "to": "2016-10-11 08:13:11.221681+00:00", "desc": "man2 ger2, awd awd", "color": "red", "id": 24}, {"duration": 10, "progressColor": "green", "start_date": "06-09-2016", "progress": 1, "text": "NEW", "values": [{"from": "/Date(1473120000000.0)/", "label": "NEW/ OVERDUE", "customClass": "ganttBlue", "to": "/Date(1473379200000.0)/"}, {"from": "/Date(1473379200000.0)/", "label": "", "customClass": "ganttRed", "to": "/Date(1476173591224.7468)/"}], "name": "<a href='/schedule/task_view?id=23'>tes</a>", "to": "2016-10-11 08:13:11.224747+00:00", "desc": "man2 ger2, awd awd", "color": "red", "id": 23}, {"duration": 10, "progressColor": "green", "start_date": "12-09-2016", "progress": 1, "text": "CLOSED", "name": "<a href='/schedule/task_view?id=27'>test</a>", "to": "14-09-2016", "desc": "Maneger wdawd", "color": "red", "id": 27}, {"duration": 10, "progressColor": "green", "start_date": "29-08-2016", "progress": 1, "text": "CLOSED", "values": [{"from": "/Date(1472428800000.0)/", "label": "CLOSED/ OVERDUE", "customClass": "ganttGray", "to": "/Date(1472601600000.0)/"}, {"from": "/Date(1472601600000.0)/", "label": "", "customClass": "ganttRed", "to": "/Date(1473836475271.8699)/"}], "name": "<a href='/schedule/task_view?id=30'>2dadaw</a>", "to": "2016-09-14 07:01:15.271870+00:00", "desc": "worker celera", "color": "red", "id": 30}, {"duration": 10, "progressColor": "green", "start_date": "04-09-2016", "progress": 1, "text": "PROCESSING", "values": [{"from": "/Date(1472947200000.0)/", "label": "PROCESSING/ OVERDUE", "customClass": "ganttOrange", "to": "/Date(1473379200000.0)/"}, {"from": "/Date(1473379200000.0)/", "label": "", "customClass": "ganttRed", "to": "/Date(1476173591234.543)/"}], "name": "<a href='/schedule/task_view?id=29'>test date</a>", "to": "2016-10-11 08:13:11.234543+00:00", "desc": "Maneger wdawd", "color": "red", "id": 29}]

};

var projects_with_milestones = {
	"data":[
		{"id":11, "text":"Project #1", type:gantt.config.types.project, "progress": 0.6, "open": true},

		{"id":12, "text":"Task #1", "start_date":"03-04-2013", "duration":"5", "parent":"11", "progress": 1, "open": true},
		{"id":13, "text":"Task #2", "start_date":"03-04-2013", type:gantt.config.types.project, "parent":"11", "progress": 0.5, "open": true},
		{"id":14, "text":"Task #3", "start_date":"02-04-2013", "duration":"6", "parent":"11", "progress": 0.8, "open": true},
		{"id":15, "text":"Task #4", type:gantt.config.types.project, "parent":"11", "progress": 0.2, "open": true},
		{"id":16, "text":"Final milestone", "start_date":"15-04-2013", type:gantt.config.types.milestone, "parent":"11", "progress": 0, "open": true},

		{"id":17, "text":"Task #2.1", "start_date":"03-04-2013", "duration":"2", "parent":"13", "progress": 1, "open": true},
		{"id":18, "text":"Task #2.2", "start_date":"06-04-2013", "duration":"3", "parent":"13", "progress": 0.8, "open": true},
		{"id":23, "text":"Mediate milestone", "start_date":"14-04-2013", type:gantt.config.types.milestone, "parent":"15", "progress": 0, "open": true}
	],
	"links":[
		{"id":"10","source":"11","target":"12","type":"1"},
		{"id":"11","source":"11","target":"13","type":"1"},

		{"id":"21","source":"15","target":"23","type":"0"}
	]
};
