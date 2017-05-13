var app = express();

app.get("/UFOreports", function(req, res){
  getData(res);
});

app.listen("3300", function(){
  console.log('Server up: localhost:3300');
});

