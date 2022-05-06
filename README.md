# MetNorwayCachingProxy
Caching proxy for getting weather info from https://www.met.no/ 

This program requests weather data every 15 minutes from met.no (Norwegian meteorological institute).
To avoid overloading met.no with API calls the 'If-Modified-Since' functionality in the request HTTP header is used.

This proxy is running on my Raspberry PI3 under Arch linux. The retrieved weather data is being served to the outside world via a HTTPS webserver  running on the same Raspberry PI3. 

I use this proxy myself to retrieve weahter information via a custom Garmin watchface (running on Garmin smart watches).

The GPS coordinates of the location for which the weather must be retrieved can be passed via the GET request to the HTTPS server in the js script.
