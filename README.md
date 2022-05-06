# MetNorwayCachingProxy
Caching proxy for getting weather info from https://www.met.no/ 

This program requests weather data every 15 minutes from met.no (Norwegian meteorological institute). To avoid overloading met.no with API calls the 'If-Modified-Since' functionality in the request HTTP header is used.

The retrieved weather data is being served to the outside world via a HTTPS webserver. 
The GPS coordinates of the location for which the weather must be retrieved can be passed via the GET request to the HTTPS server in the js script.

I use this proxy myself to retrieve weather information via a custom Garmin watchface (running on Garmin smart watches).

