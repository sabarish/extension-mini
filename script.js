// Code goes here
$(document).ready(function() {
   $.getJSON('data.json',function(json){
      var response = '',
          indicator = '';
      for(var i=0; i < json.results.length; i++){
        response += '<div class="item"><div><center><img alt="Profilepicture" title="New Hire" id="" class="table-bordered thick-border img-circle" src="' + json.results[i].image + '" width="50%" height="75%"></center></div><div class=""><center><h3>' + json.results[i].Title + '</h3><p>' + json.results[i].Content + '</p><h5>Match Summary</h5></center></div></div>';
        // indicator += '<li data-target="#myCarousel" data-slide-to="'+i+'"></li>';
      }
      $('#homepageItems').append(response);
      $('#indicators').append(indicator);
      $('.item').first().addClass('active');
      $('.carousel-indicators > li').first().addClass('active');
      $("#myCarousel").carousel();
   });
});