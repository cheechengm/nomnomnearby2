require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Your HTML content as a string
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Google Map</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            background-color: #f5f5f5;
            padding: 0;
        }
        .container {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1, h3 {
            text-align: center;
        }
        #map {
            height: 400px;
            width: 100%;
            margin-bottom: 20px;
            border-radius: 8px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        input[type="text"] {
            width: 100%;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #ccc;
            box-sizing: border-box;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        button {
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background-color: #0056b3;
        }
        #randomRestaurant {
            font-weight: bold;
        }
    </style>
</head>
 <body>
    <div class="container">
        <br><br>
        <h1 class="text-center">NomNomNearby</h1>
        <p>Having a hard time deciding what to eat? Not to worry! NomNomNearby will help you pick a restaurant!<p>
            <p></p>
            <br>
        <div id="map"></div>
        <div class="form-group">
            <label for="location">Enter Location :</label>
            <br><br>
            <input type="text" class="form-control" id="autocomplete" placeholder="Enter a Location">
        </div>
        <!--
        <br>
        <div class="form-group">
            <label for="type">Select Place Type:</label>
            <br>
            <select class="form-control" name="type" id="type">
                <option id="restaurant">restaurant</option>
            </select>
        </div>
    -->
        <br><br>
        <table class="table table-bordered table-striped" id="places"></table>
        <button onclick="pickRandomRestaurant()">Pick a Random Restaurant</button>
        <p id="randomRestaurant"></p>
    </div>

    <script>
        var restaurant = [];
        var map;
        var markers = [];
        var table;

      function initMap() {
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('autocomplete'),
        { types: ['geocode'] }
    );

    autocomplete.addListener('place_changed', searchNearbyPlaces);
}

        function searchNearbyPlaces() {
            document.getElementById('places').innerHTML = '';

            var place = autocomplete.getPlace();
            console.log(place);
            var map = new google.maps.Map(document.getElementById('map'), {
                center: place.geometry.location,
                zoom: 15
            });

            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                location: place.geometry.location,
                radius: '500',
                //type: [document.getElementById('type').value]
                type:['restaurant']
            }, callback);
        }
        function callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                console.log(results.length);
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                }
            }
        }
         
        function createMarker(place) {
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
                title: place.name
            });
            markers.push(marker);
            console.log(place);
            var table = document.getElementById("places");
            var row = table.insertRow();
            var cell1 = row.insertCell(0);
            cell1.innerHTML = place.name;
            if (place.photos) {
                var photoUrl = place.photos[0].getUrl();
                var cell2 = row.insertCell(1);
                cell2.innerHTML = '<img width="300" height="300" src="' + photoUrl + '">';
            } else {
                var photoUrl = "https://via.placeholder.com/150";
                var cell2 = row.insertCell(1);
                cell2.innerHTML = '<img width="300" height="300" src="' + photoUrl + '">';
            }
        }

        function pickRandomRestaurant() {
            var table = document.getElementById("places");
            var rowCount = table.rows.length;
            if (rowCount > 0) {
                var randomIndex = Math.floor(Math.random() * rowCount);
                var randomRow = table.rows[randomIndex];
                var randomRestaurantName = randomRow.cells[0].innerText;
                document.getElementById("randomRestaurant").innerText = "Randomly selected restaurant: " + randomRestaurantName;
            } else {
                document.getElementById("randomRestaurant").innerText = "No restaurants found nearby.";
            }
        }
    /*
    function initMap(){
        var options = {
            zoom:16,
            center:{lat:1.3483,lng:103.6831}
        }
    
        let map = new google.maps.Map(document.getElementById('map'),options);

        let markerOptions = {
            position: new google.maps.LatLng(1.3483,103.6831),
            map: map
            
        }

        let marker = new google.maps.Marker(markerOptions)

        

        
    } */
    </script>

<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&libraries=places&callback=initMap"></script>

</body>
</html>
`;

// Serve the HTML file when a request is made to the root URL
app.get('/', (req, res) => {
    res.send(htmlContent.replace('YOUR_API_KEY_HERE', process.env.GOOGLE_MAPS_API_KEY)); // Replace placeholder with API key
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});