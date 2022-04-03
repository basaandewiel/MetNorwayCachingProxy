# MetNorwayCachingProxy
Caching proxy for getting weather info from https://www.met.no/ 

This program requests weather data every 15 minutes from met.no (Norwegian meteorological institute).
To avoid overloading met.no with API calls the 'If-Modified-Since' functionality in the request HTTP header is used.

The retrieved weather data is being served via a HTTPS webserver. In this way it is possible to retrieve the weahter information via a custom Garmin watchface (running on Garmin smart watches).

The GPS coordinates of the location for which the weather must be retrieved can be passed via the GET request to the HTTPS server in the js script.
