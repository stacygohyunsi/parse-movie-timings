# parse-movie-timings
Something I did awhile back - get movie timings for all movies in Cathay Cineplexes around Singapore using Cheerio parser. Includes the movie titles, locations and timings for today so you can see everything easily in a glance, compiled neatly for you in JSON file. 

# How to use

Simply download the repo and `npm start` to get a json file of the movie titles, timings and locations.

# Example of the JSON file

```
"*Shock Wave PG13": {
		"href": "/movies/shock-wave-pg13/",
		"locations": [{
			"name": "AMK HUB",
			"timings": [{
				"value": "18:45"
			}, {
				"value": "20:20"
			}, {
				"value": "21:20"
			}]
		}, {
			"name": "CAUSEWAY POINT",
			"timings": [{
				"value": "19:15"
			}, {
				"value": "21:50"
			}]
		}
}
```

# Credits
Project is purely for fun and all credits and copyrights belong to [Cathay Cineplex](https://www.cathaycineplexes.com.sg/)