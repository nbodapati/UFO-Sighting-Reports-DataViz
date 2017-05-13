//import express package
var express = require("express");
//import mongodb package
var mongodb = require("mongodb");

//MongoDB connection URL - mongodb://host:port/dbName
    var dbHost = "mongodb://localhost:2417/UFOreports";
     
    //Use the MongoClient to connect to the db as shown below:
    //DB Object
    var dbObject;
     
    //get instance of MongoClient to establish connection
    var MongoClient = mongodb.MongoClient;  
    //Connecting to the Mongodb instance.
    //Make sure your mongodb daemon mongod is running on port 27017 on localhost
    MongoClient.connect(dbHost, function(err, db){
      if ( err ) throw err;
      dbObject = db;
	  years_list=[];
	  
	  console.log("Successful connection!");
	//  getYears();         	                  
	 // getData(2012);
    });
var app = express();
//var urlencode = require('urlencode');
var bodyParser = require('body-parser')
//var qs = require('querystring');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
//app.use(urlencode);

//Defining middleware to serve static files
app.use('/public', express.static('public'));


app.listen("3300", function(){
  console.log('Server up: localhost:3300');
});

	function getYears(){
      //use the find() API and pass an empty query object to retrieve all records
      dbObject.collection("sentence_sentiment").distinct("Year",function(err, docs){
        if ( err ) throw err;
	  console.log(docs);
       return docs; 
	   
	   })
	}
	
	function getData(year){
      //use the find() API and pass an empty query object to retrieve all records
	  	d=[];
      dbObject.collection("sentence_sentiment").find({"Year":year,"Country":'us'}).toArray(function(err, docs){
        if ( err ) throw err;
		console.log(docs.length);
	
         for ( index in docs){
           var doc = docs[index];
		  // console.log(JSON.stringify(doc));
		   d.push(doc);
		   }
	   })
	   
	   dbObject.collection("sentence_sentiment").aggregate(
     [
       { $match: { "Year":2012} },
       { $group: { "_id": "$Country" , "count": { $sum: 1 } } }
     ]).toArray(function(err, result) {
        if(err) throw err;
       console.log(JSON.stringify(result));
	 });
	 
	 return d;
	}
	
function rangefn(start, stop, step){
  var a=[start], b=start;
  while(b<stop){b+=step;a.push(b)}
  return a;
};
	
	
	
app.get("/", function(req, res){
 // getData(1976,res);
 var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu"); 
});

app.get('/UFOreports', function(req, res){
  // CSP headers
//console.log("RQ:",req);
 var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu"); 
  dbObject.collection("sentence_sentiment").distinct("Year",function(err, docs){
        if ( err ) throw err;
	 // console.log(docs);
    res.set('Access-Control-Allow-Credentials',"true");
  res.set("Access-Control-Allow-Headers", "X-Requested-With");
	 res.set("Access-Control-Allow-Origin",origin);
//console.log("RES",res);
  
   res.send(docs);
	   
	   })
  
 });

//For the pie chart.
 app.post('/UFOreports_PieChart', function(req, res){
	 console.log("REquested year:",(req.body));
    
  var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu");
  dbObject.collection('sentence_sentiment').aggregate(
     [
       { $match: { "Year": +req.body.value} },
       { $group: { "_id": "$Country" , "count": { $sum: 1 } } }
     ]).toArray(function(err, result) {
       
       console.log(result);
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
   console.log(result);	 
     res.send(result);
     });
 
 });
 
app.get('/UFOreports_Shapes', function(req, res){
  // CSP headers
  var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu");
  dbObject.collection("sentence_sentiment").distinct("Shape",function(err, docs){
        if ( err ) throw err;
	  //console.log(docs);
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
  
  res.send(docs);
	   
	   })
  
 });
 
 app.get('/UFOreports_Countries', function(req, res){
  // CSP headers
  var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu");
  dbObject.collection("sentence_sentiment").distinct("Country",function(err, docs){
        if ( err ) throw err;
	 // console.log(docs);
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
  
   res.send(docs);
	   
	   })
  
 });
 
 app.get('/UFOreports_Cities', function(req, res){
  // CSP headers
  var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu");
  dbObject.collection("sentence_sentiment").distinct("City",function(err, docs){
        if ( err ) throw err;
	  //console.log(docs);
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
  
   res.send(docs);
	   
	   })
  
 });
 
 //For the SG graph
 app.post('/UFOreports_SGchart', function(req, res){
	// console.log("REquested year:",req.body.value);
	// console.log("REquested type:",req.body.type); //shapes,countries,cities
	 
  var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu");
  dbObject.collection('sentence_sentiment').aggregate(
     [
       { $match: { "Year":+req.body.value} },
       { $group: { "_id": "$"+req.body.type , "count": { $sum: 1 } } }
     ]).toArray(function(err, result) {
       
      // console.log(result);
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
      
     res.send(result);
     });
 
 });
 
 app.post('/UFOreports_pcoordChart', function(req, res){
	// console.log("REquested year:",req.body.year);
	 
  var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu");
  dbObject.collection("sentence_sentiment").find({"Year":+req.body.year,"Country":req.body.Country,"Month":+req.body.Month}).toArray(function(err, docs){
        if ( err ) throw err;
		//console.log("REquested year stats:",JSON.stringify(docs));
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
      
     res.send(docs);
	   })
 });
 
 app.post('/UFOreports_FDchart', function(req, res){
  var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu");
	// console.log("REquested :",req.body.type);
	 var response=[];
	     var year= req.body.Year;
		 //console.log("Year:",year);
		 
		 if(year=="all")
		 {
		 dbObject.collection("sentence_sentiment_tsne").find({}).toArray(function(err, docs){
        if ( err ) throw err;
		//console.log("REquested docs:",JSON.stringify(docs));
	  docs.forEach(function(x){
		  var stats={};
		  stats.cluster=x.Sentiment;
		  stats.radius=5;
		  stats.r="us";
		  response.push(stats);  
	
	  })
	  
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
	  //console.log("REquested docs:",JSON.stringify(response));
     res.send(response);
	   })
		 }
		 else{
			 
			 dbObject.collection("sentence_sentiment").find({"Year":+year}).toArray(function(err, docs){
        if ( err ) throw err;
		//console.log("REquested docs:",JSON.stringify(docs));
	  docs.forEach(function(x){
		  var stats={};
		  stats.cluster=x.Sentiment;
		  stats.radius=5;
          stats.r=x.Country;
		  response.push(stats);  
	
	  })
	  
	  console.log("REquested docs:",JSON.stringify(response));
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
     res.send(response);
	   })
			 
		 }
	 });
 
 app.post('/UFOreports_Closest', function(req, res){
       var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu");
	 var response=[];
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
	console.log(req.body.word); 
		 dbObject.collection("word_count_similarity").find({"Word":req.body.word}).toArray(function(err, docs){
        if ( err ) throw err;
		console.log("REquested docs:",JSON.stringify(docs));
       
	       var x=docs[0];
		   
		  var stats={};
		  
		  stats.sim=x.Sim1;
		  stats.min=x.Dist1*10;
		  stats.max=x.Dist1*10; 
          response.push(stats);  
   
		  stats={};
		  stats.sim=x.Sim2;
		  stats.min=x.Dist2*10;
		  stats.max=x.Dist2*10; 
          response.push(stats);
		  
		  stats={};
		  stats.sim=x.Sim3;
		  stats.min=x.Dist3*10;
		  stats.max=x.Dist3*10; 
          response.push(stats); 
		  
		  stats={};
		  stats.sim=x.Sim4;
		  stats.min=x.Dist4*10;
		  stats.max=x.Dist4*10; 
          response.push(stats); 
		  
		  stats={};
		  stats.sim=x.Sim5;
		  stats.min=x.Dist5*10;
		  stats.max=x.Dist5*10; 
          response.push(stats);  
		   
		
	 // console.log("REquested cg stats:",JSON.stringify(response));
     res.send(response);
	   })
		 
	 });
 
 
 
 app.post('/UFOreports_CGchart', function(req, res){
	 console.log("REquested :",req.body.type);
  var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu");
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
	 var response=[];
	 
		 dbObject.collection("word_count_tsne").find({}).toArray(function(err, docs){
        if ( err ) throw err;
		//console.log("REquested docs:",JSON.stringify(docs));
      
	  var x1=1; var y=0;
	  docs.forEach(function(x){
		  var stats={};
		  stats.name=x.Word;
		  stats.r=x.Count;
		  y=y+1;
		  if(y==11)
		  {
			  x1=x1+1;
			  y=1;
		  };
		  stats.x=x1;
		  stats.y=y;
		  response.push(stats);  
	  
	  })
	  
	  //console.log("REquested cg stats:",JSON.stringify(response));
     res.send(response);
	   })
		 
	 });

	 app.post('/UFOreports_table', function(req, res){
           var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu");
	   var response=[];
	   
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
	   var state=req.body.State;
	   var year= +req.body.Year;
       console.log(state,year);
	   
	   dbObject.collection("sentence_sentiment").find({"Year": year,"State":state}).toArray(function(err, docs){ 	  
      	    if(err) throw err;		
	  console.log("REquested table docs:",JSON.stringify(docs));
 
    var output =[];
	var out={};
	docs.forEach(function(x)
	 {
		out[x.Month]={};		
	    out[x.Month]['Month']=	x.Month;
		out[x.Month]['Count']=0;
		out[x.Month]['Sentiment0']=0;
		out[x.Month]['Sentiment1']=0;
		out[x.Month]['Time_hrs']=0;
	  });
	  
	  docs.forEach(function(x)
	 {
		
		out[x.Month]['Count'] +=1;
		
		if(x.Sentiment==0)
		out[x.Month]['Sentiment0']+=1;
	    else if(x.Sentiment==1)
			out[x.Month]['Sentiment1']+=1;
		
	    out[x.Month]['Time_hrs'] +=x.Time_hrs;			 
	  });
	  
	  for(key in out )
	  {
		  output.push(out[key]);
	  }
	  
     console.log("REquested docs:",JSON.stringify(output));
	 res.send(output);
 
  });
 });
	 
	 
 app.post('/UFOreports_Bubble', function(req, res){
  var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu");
	   var response=[];
	   var country=req.body.Country;
	   var year= +req.body.Year;

    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
	   dbObject.collection("sentence_sentiment").aggregate(
   [
       { $match: {"Year": year,"Country":country} },
	   { $group : {
        _id : {City:"$City"},
        count : { $sum : 1 }
      }}
   ]
).toArray(function(err, docs){ 	  
      	    if(err) throw err;		
	  //console.log("REquested docs:",JSON.stringify(docs));
 
    var output =[];
	docs.forEach(function(x)
	 {
		  console.log(x);	
		  var stats={};
		  stats.City=x._id.City;
		  stats.rad=x.count;
		  
	     output.push(stats); 			 
	  });
	  
     console.log("REquested docs:",JSON.stringify(output));
	 res.send(output);
 
  });
 });
	 
app.post('/UFOreports_LineChart2', function(req, res){
	  	   
  var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu");
	   var year= +req.body.Year;
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
        console.log("LC year: ",year);
	   dbObject.collection("sentence_sentiment").aggregate(
   [
       { $match: {"Year": year} },
	   { $group : {
        _id : {Country:"$Country",Month:"$Month",Time:"$Time_hrs"},
        count : { $sum : 1 }
      }}
   ]
).toArray(function(err, docs){ 	  
      	    if(err) throw err;		
	  console.log("REquested docs:",JSON.stringify(docs));
	 
		   var output ={};
		  
 // console.log(JSON.stringify(output));
    docs.forEach(function(x)
	 {
       output[x._id.Country]=[];
	   for (i in rangefn(1,13,1))
		   output[x._id.Country][i]=0;
	 });
	
	
	var min=10000; 
	var max=0;
	
	docs.forEach(function(x)
	 {
		  console.log(x);	//Total time in hours --country and month.
	     output[x._id.Country][x._id.Month] =output[x._id.Country][x._id.Month]+(x.count*[x._id.Time]);
          if(output[x._id.Country][x._id.Month] > max)
             max=output[x._id.Country][x._id.Month];
          if(output[x._id.Country][x._id.Month] < min)
             min=output[x._id.Country][x._id.Month];			  
	  });
    // console.log("REquested docs:",JSON.stringify(output));
	 var oup={};
	 var o=["ca","us","au","gb"];
	 
	 for (key in ["ca","us","au","gb"])
	  {
		  var response=[];
		  //console.log(key);
		  for (key2 in output[o[key]])
		  {
                var stats={}; stats._id=key2; stats.count=output[o[key]][key2];
		      response.push(stats);
		  } 
		  
		  oup[o[key]]=response;
	  }
	 
	 oup["Min"]=min;
	 oup["Max"]=max;
	 
	 
	 
	 console.log("REquested docs:",JSON.stringify(oup));
	 res.send(oup);
 
  });
 });	

	
app.post('/UFOreports_LineChart', function(req, res){
	  	   
  var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu");
	   var year= +req.body.Year;
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
	   dbObject.collection("sentence_sentiment").aggregate(
   [
       { $match: {"Year": year} },
	   { $group : {
        _id : {Country:"$Country",Month:"$Month"},
        count : { $sum : 1 }
      }}
   ]
).toArray(function(err, docs){ 	  
      	    if(err) throw err;		
	 
		   var output ={};
		  
 // console.log(JSON.stringify(output));
    docs.forEach(function(x)
	 {
       output[x._id.Country]=[];
	   for (i in rangefn(1,13,1))
		   output[x._id.Country][i]=0;
	 });
	
	
	var min=10000; 
	var max=0;
	
	docs.forEach(function(x)
	 {
		  console.log(x);	
	     output[x._id.Country][x._id.Month] =x.count;
          if(x.count > max)
             max=x.count;
          if(x.count < min)
             min=x.count;			  
	  });
    // console.log("REquested docs:",JSON.stringify(output));
	 var oup={};
	 var o=["ca","us","au","gb"];
	 
	 for (key in ["ca","us","au","gb"])
	  {
		  var response=[];
		  //console.log(key);
		  for (key2 in output[o[key]])
		  {
                var stats={}; stats._id=key2; stats.count=output[o[key]][key2];
		      response.push(stats);
		  } 
		  
		  oup[o[key]]=response;
	  }
	 
	 oup["Min"]=min;
	 oup["Max"]=max;
	 
	 
	 
	 console.log("REquested docs:",JSON.stringify(oup));
	 res.send(oup);
 
  });
 });
	 
    app.post('/UFOreports_Choropleth', function(req, res){
           var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu");
	   var response=[];
	   var type=req.body.type;
	   var year= +req.body.Year;
    console.log(year);
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
	   dbObject.collection("sentence_sentiment").aggregate(
   [
       { $match: {"Year": year} },
	   { $group : {
        _id : {Country:"$Country"},
        count : { $sum : 1 }
      }}
   ]
).toArray(function(err, docs){ 	  
      	    if(err) throw err;		
	  //console.log("REquested docs:",JSON.stringify(docs));
	 
		   var output ={};
		  
 // console.log(JSON.stringify(output));
    docs.forEach(function(x)
	 {
       output[x._id.Country]=0;
	 });
	
	docs.forEach(function(x)
	 {
		 // console.log(x);	
	     output[x._id.Country] =x.count; 			 
	  });
     //console.log("REquested docs:",JSON.stringify(output));
	 res.send(output);
 
  });
 });
	 	
 app.post('/UFOreports_Choropleth2', function(req, res){
	   var response=[];
           var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu");
	   var type=req.body.type;
	   var year= +req.body.Year;

    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
	   dbObject.collection("sentence_sentiment").aggregate(
   [
       { $match: {"Year": year,"Country":"us"} },
	   { $group : {
        _id : {State:"$State"},
        count : { $sum : 1 }
      }}
   ]
).toArray(function(err, docs){ 	  
      	    if(err) throw err;		
	  //console.log("REquested docs:",JSON.stringify(docs));
	 
	
	var output ={};
		  
 // console.log(JSON.stringify(output));
    docs.forEach(function(x)
	 {
       output[x._id.State.toUpperCase()]=0;
	 });
	
	docs.forEach(function(x)
	 {
		 // console.log(x);	
	     output[x._id.State.toUpperCase()] =x.count; 			 
	  });
     //console.log("REquested docs:",JSON.stringify(output));
	 res.send(output);
 
  });
 });
	 	
		 app.post('/UFOreports_slopegraph', function(req, res){
	   var response=[];
	   var start_year=req.body.y1;
	   var end_year=req.body.y2;

	   dbObject.collection("sentence_sentiment").aggregate(
   [
	   { $group : {
        _id : {Shape:"$Shape", Year: "$Year"},
        count : { $sum : 1 }
      }}
   ]
).toArray(function(err, docs){ 	  
      	    if(err) throw err;		
	  //console.log("REquested docs:",JSON.stringify(docs));
	 
		   var output ={};
		   var response=[];
		  
 // console.log(JSON.stringify(output));
    docs.forEach(function(x)
	 {
       output[x._id.Shape]={};
	 });
	
	docs.forEach(function(x)
	 {
		 // console.log(x);
		 output[x._id.Shape]['Shape']=x._id.Shape;	
	     output[x._id.Shape][x._id.Year] =x.count; 			 
	  });
	  
	  for (key in output)
		  {

		      response.push(output[key]);
		  } 
		  
    // console.log("REquested docs:",JSON.stringify(response));
	 res.send(response);
 
  });
 });
	 

	
    app.post('/UFOreports_slopegraph2', function(req, res){
	   var response=[];
          var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu");
	   var start_year=+req.body.y1;
	   var end_year=+req.body.y2;

    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
	   dbObject.collection("sentence_sentiment").aggregate(
   [
	   { $group : {
        _id : {Country:"$Country", Year: "$Year"},
        count : { $sum : 1 }
      }}
   ]
).toArray(function(err, docs){ 	  
      	    if(err) throw err;		
	  //console.log("REquested docs:",JSON.stringify(docs));
	 
		   var output ={};
		   var response=[];
		  
 // console.log(JSON.stringify(output));
    docs.forEach(function(x)
	 {
       output[x._id.Country]={};
	 });
	
	docs.forEach(function(x)
	 {
		 // console.log(x);
		 output[x._id.Country]['Country']=x._id.Country;	
	     output[x._id.Country][x._id.Year] =x.count; 			 
	  });
	  
	  for (key in output)
		  {

		      response.push(output[key]);
		  } 
		  
    // console.log("REquested docs:",JSON.stringify(response));
	 res.send(response);
 
  });
 });
	 
	 
 app.post('/UFOreports_sunburst', function(req, res){
  var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu");
  var response=[];
	   
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
	   var year=+req.body.Year;
	   console.log("Year",year);

	   dbObject.collection("sentence_sentiment").aggregate(
   [
        { $match: { "Year": year} },
	   { $group : {
        _id : {Time:"$Time",Month:"$Month"},
        count : { $sum : 1 }
      }}
   ]
).toArray(function(err, docs){ 	  
      	    if(err) throw err;	
     
	 docs.sort(function(a, b) {
         return parseFloat(a._id.Month) - parseFloat(b._id.Month);
     });			
	 // console.log("REquested docs:",JSON.stringify(docs));
		   
		   var output =[];
		   var resp=[];
		  var i=1;
	  docs.forEach(function(x)
	  {
		 // console.log(x);
		 var stats={};
	     stats.Expt =x._id.Month;
		 var hour=x._id.Time.split(":")[0];		
         stats.Run=hour;	
         stats.Speed=x.count;
         output.push(stats);       		 
	  });
	 
	 
	 
     //console.log("REquested docs:",JSON.stringify(output));
	 res.send(output);
 
  });
 });
	 
app.post('/UFOreports_heatmap', function(req, res){
	   var response=[];
	   
           var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu");
	   var year=+req.body.Year;
	   console.log("Year",year);
           
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
	   dbObject.collection("sentence_sentiment").aggregate(
   [
        { $match: { "Year": year} },
	   { $group : {
        _id : {Shape:"$Shape",Month:"$Month"},
        count : { $sum : 1 }
      }}
   ]
).toArray(function(err, docs){ 	  
      	    if(err) throw err;	
     
	 docs.sort(function(a, b) {
         return parseFloat(a._id.Month) - parseFloat(b._id.Month);
     });			
	 // console.log("REquested docs:",JSON.stringify(docs));
		   
		   var output =[];
		   var resp=[];
		  var i=1;
	  docs.forEach(function(x)
	  {
		 // console.log(x);
		 var stats={};
	     stats.Expt =x._id.Month;
         stats.Run=x._id.Shape;	
         stats.Speed=x.count;
         output.push(stats);       		 
	  });
	 
	 
	 
     //console.log("REquested docs:",JSON.stringify(output));
	 res.send(output);
 
  });
 });
	 
function objLen(obj)
	 {
		 var count = 0;

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
		 
   }
	 
 app.post('/UFOreports_chChart3', function(req, res){
	   var response=[];
	   
  var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu");
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
	 dbObject.collection("sentence_sentiment").aggregate(
   [
      { $match: { "Year": +req.body.Year} },
	   { $group : {
        _id : {Month : "$Month",Country: "$Country"},
        count : { $sum : 1 }
      }}
   ]
).toArray(function(err, docs){ 	  
      	    if(err) throw err;		
	
	docs.sort(function(a, b) {
         return parseFloat(a._id.Month) - parseFloat(b._id.Month);
     });
	 
	// console.log("REquested docs:",JSON.stringify(docs));     
	 var output = {};
     var countries=["ca","gb","us","au"];
     docs.forEach(function(x)
	   {
		  output[x._id.Month]={};
		  for(i in countries)
		  {	
		output[x._id.Month][countries[i]]=0;
			  
		  }
	  });
     // console.log(JSON.stringify(output));
	  
	  docs.forEach(function(x)
	  {
		//    console.log(x);
		    output[x._id.Month][x._id.Country] =x.count;  	 		  
		   
	  });
	  
	  //console.log(JSON.stringify(output));
	  
	  for (key in rangefn(1,12,1))
	  {
		  //console.log(key);
		  for (key2 in output[key])
		  {

		      response.push(output[key][key2]);
		  } 
	  }
     //console.log("REquested docs:",JSON.stringify(response));
	 res.send(response);
	});
 });
 
 
 app.post('/UFOreports_chChart2', function(req, res){
	   var response=[];
 console.log("REquested year:",req.body);
  var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu");
	   
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
	 dbObject.collection("sentence_sentiment").aggregate(
   [
      { $match: { "Year": +req.body.Year} },
	   { $group : {
        _id : {Month : "$Month",Sentiment: "$Sentiment"},
        count : { $sum : 1 }
      }}
   ]
).toArray(function(err, docs){ 	  
      	    if(err) throw err;		
	
	docs.sort(function(a, b) {
         return parseFloat(a._id.Month) - parseFloat(b._id.Month);
     });
	 
	 //console.log("REquested docs:",JSON.stringify(docs));     
	 var output = {};
  
     docs.forEach(function(x)
	   {
		  output[x._id.Month]={};
		  for(i in rangefn(0,1,1))
		  {	
		output[x._id.Month][i]=0;
			  
		  }
	  });
     // console.log(JSON.stringify(output));
	  
	  docs.forEach(function(x)
	  {
		//    console.log(x);
		    output[x._id.Month][x._id.Sentiment] =x.count;  	 		  
		   
	  });
	  
	 // console.log(JSON.stringify(output));
	  
	  for (key in rangefn(1,12,1))
	  {
		  //console.log(key);
		  for (key2 in output[key])
		  {

		      response.push(output[key][key2]);
		  } 
	  }
     //console.log("REquested docs:",JSON.stringify(response));
	 res.send(response);
	});
 });
 
 
 
 
 app.post('/UFOreports_chChart', function(req, res){
	   var response=[];
  var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu");
	   
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
	 dbObject.collection("sentence_sentiment").aggregate(
   [
      { $match: { "Year": +req.body.Year} },
	   { $group : {
        _id : {Month : "$Month",Day: "$Day"},
        count : { $sum : 1 }
      }}
   ]
).toArray(function(err, docs){ 	  
      	    if(err) throw err;		
	
	docs.sort(function(a, b) {
         return parseFloat(a._id.Month) - parseFloat(b._id.Month);
     });
	  
	 //console.log("REquested docs:",JSON.stringify(docs));     
	 var output = {};
  
     docs.forEach(function(x)
	   {
		  output[x._id.Month]={};
		  for(i in rangefn(1,32,1))
		  {	
		output[x._id.Month][i]=0;
			  
		  }
	  });
     // console.log(JSON.stringify(output));
	  
	  docs.forEach(function(x)
	  {
		//    console.log(x);
		    output[x._id.Month][x._id.Day] =x.count;  	 		  
		   
	  });
	  
	  //console.log(JSON.stringify(output));
	  
	  for (key in rangefn(1,12,1))
	  {
		  //console.log(key);
		  for (key2 in output[key])
		  {
			// console.log(key2);
		     if(key2==0)
				 continue;
		      response.push(output[key][key2]);
		  } 
	  }
     //console.log("REquested docs:",JSON.stringify(response));
	 res.send(response);
	});
 });
 
 
 
 app.post('/UFOreports_AreaChart2', function(req, res){
	   var response=[];
  var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu");
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
	 dbObject.collection("sentence_sentiment").aggregate(
   [
      
	   { $group : {
        _id : {Year : "$Year",Sentiment: "$Sentiment"},
        count : { $sum : 1 }
      }}
   ]
).toArray(function(err, docs){ 	  
      	    if(err) throw err;
			
	 // console.log("REquested docs:",JSON.stringify(docs));
	
	 
	   
	  docs.sort(function(a, b) {
    return parseFloat(a._id.Year) - parseFloat(b._id.Year);
});
	   
	   var output = {};
  
      docs.forEach(function(x)
	  {
		  output[x._id.Year]={sent0:0,sent1:0};
	  });
  
	  docs.forEach(function(x)
	  {
		  
		 // console.log(x);
		  
			  
		   if(x._id.Sentiment==0)
		  {  
		    output[x._id.Year].Year =x._id.Year;  	  
		    output[x._id.Year].sent0 =x.count; 
		  }
		   else if(x._id.Sentiment==1)
		  {
		    output[x._id.Year].Year =x._id.Year;  	  
		    output[x._id.Year].sent1 =x.count; 
		  }	  
			  		  
		  
		   
	  });
	  
	  for (key in output)
	  {
		//  console.log(key,output[key]);
		response.push(output[key]);
		  
	  }
   //  console.log("REquested docs:",JSON.stringify(output));
	 res.send(response);
	});
 });
 
 
 
 
 
 app.post('/UFOreports_AreaChart', function(req, res){
  var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu");
	 
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
	 dbObject.collection("sentence_sentiment").aggregate(
   [
      
	   { $group : {
        _id : {Year : "$Year",Sentiment: "$Sentiment"},
        count : { $sum : 1 }
      }}
   ]
).toArray(function(err, docs){ 	  
      	    if(err) throw err;
	 // console.log("REquested docs:",JSON.stringify(docs));
	  var response=[];
	  var i0=1;
	   var i1=1;
	   
	  docs.sort(function(a, b) {
    return parseFloat(a._id.Year) - parseFloat(b._id.Year);
});
	   
	  docs.forEach(function(x)
	  {
		  console.log(x);
		if(x._id.Sentiment==0)
		{
			var stats={};
			stats.expt=1;
			stats.run=i0;
		    stats.Speed=x.count;
            i0=i0+1;
			
		}			
		  else 
		if(x._id.Sentiment==1)
		{
			var stats={};
			stats.expt=2;
			stats.run=i1;
		    stats.Speed=x.count;
            i1=i1+1;
			
		}	
		  response.push(stats);
	  });
	  
 //    console.log("REquested docs:",JSON.stringify(response));
	 res.send(response);
	});
 });
 
 
 app.post('/UFOreports_BoxChart', function(req, res){
	 //console.log("REquested year:",req.body.type);
  var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu");
	 var response=[];
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
	 
		 dbObject.collection("sentence_sentiment").find({}).toArray(function(err, docs){
        if ( err ) throw err;
		//console.log("REquested docs:",JSON.stringify(docs));
      var i=0;
	  docs.forEach(function(x){
		  i=i+1;
		  var stats={};
		  stats.expt=1;
		  stats.run=i;
		  stats.value=x[req.body.type];
		  response.push(stats);  
	  })
	  console.log("REquested docs:",JSON.stringify(response));
     res.send(response);
	   })
		 
 });
 
 
 app.post('/UFOreports', function(req, res){		 
 
 console.log("REquested year:",req.body);
  var origin = (req.headers.origin || "http://edlab-www.cs.umass.edu");
  if(req.body.type=="Counts"){  
	dbObject.collection('sentence_sentiment').aggregate(
     [
       { $group: { "_id": "$"+req.body.message, "count": { $sum: 1 } } }
     ]).toArray(function(err, result) {
     if(err) throw err;
       console.log("p1",result);
 	  
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
      
     res.send(result);
	 })	 
	 }
	 
	 else if(req.body.type=="match_counts")
	 {
		 if(req.body.message1=="Year")
		 {
		 dbObject.collection('sentence_sentiment').aggregate(
     [
       { $match: { "Year": +req.body.value1} },
       { $group: { "_id": "$"+req.body.message2 , "count": { $sum: 1 } } }
     ]).toArray(function(err, result) {
        if(err) throw err;
       console.log("p1",result);
      
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
     res.send(result);
     });
	 }
	 else if(req.body.message1=="Country")
	 {
		  dbObject.collection('sentence_sentiment').aggregate(
     [
       { $match: { "Country": req.body.value1} },
      { $group: { "_id": "$"+req.body.message2 , "count": { $sum: 1 } } }
     ]).toArray(function(err, result) {
       
   //   console.log(result);
      
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
     res.send(result);
     });
	 }
	 
	 else if(req.body.message1=="Shape")
	 {
		 if(req.body.message2=="Country-Year")
		 {
        dbObject.collection("sentence_sentiment").distinct("Year",function(err, docs){
		var years_list=docs;
		years_list.sort(function(a, b) {
             return parseFloat(a) - parseFloat(b);});
			 
			 
	 dbObject.collection("sentence_sentiment").aggregate(
       [{ $match: {"Shape": req.body.value1} },
	   { $group : {
        _id : {Country:"$Country",Year:"$Year"},
        count : { $sum : 1 }
      }}
      ]).toArray(function(err, docs){ 	  
      	    if(err) throw err;		
	 //console.log("REquested docs:",JSON.stringify(docs));
	 
		   var output ={};
		  
 // console.log(JSON.stringify(output));
    docs.forEach(function(x)
	 {
       output[x._id.Country]={};
	   for (year in years_list)
		   output[x._id.Country][years_list[year]]=0;
	 });
	 
	var min=10000; 
	var max=0;
	
	docs.forEach(function(x)
	 {
		 // console.log(x);	//Total time in hours --country and month.
	     output[x._id.Country][x._id.Year] =x.count;
          if(output[x._id.Country][x._id.Year] > max)
             max=output[x._id.Country][x._id.Year];
          if(output[x._id.Country][x._id.Year] < min)
             min=output[x._id.Country][x._id.Year];			  
	  });
     //console.log("REquested docs:",JSON.stringify(output));
	 var oup={};
	 var o=["ca","us","au","gb"];
	 
	 for (key in ["ca","us","au","gb"])
	  {
		  var response=[];
		  //console.log(key);
		  for (key2 in output[o[key]])
		  {
                var stats={}; stats._id=key2; stats.count=output[o[key]][key2];
		      response.push(stats);
		  } 
		  
		  oup[o[key]]=response;
	  }
	 
	 oup["Min"]=min;
	 oup["Max"]=max;
	// console.log("REquested docs:",JSON.stringify(oup));
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
	 res.send(oup);
		}); })
		 }
		 
		 else
		 {
		  dbObject.collection('sentence_sentiment').aggregate(
     [
       { $match: { "Shape": req.body.value1} },
       { $group: { "_id": "$"+req.body.message2 , "count": { $sum: 1 } } }
     ]).toArray(function(err, result) {
       
  //     console.log(result);
    res.set("Access-Control-Allow-Origin", origin);
    res.set('Access-Control-Allow-Credentials',"true");
     res.set("Access-Control-Allow-Headers", "X-Requested-With");
     res.send(result);
     });
	 }
	 }
	}
 });
 


