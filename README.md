# newsspec-9518: 2015_election_results_map

2015 Electiosn results map

##Starting the server
This project needs to be ran over port 80, which is restricted to root. So you have to kill your current node server, cd into this project and run 
```
sudo grunt connect
```

## Getting started

Set up the project
###Update your env.json
You must update your env.json to match the values below. This is so that the the datafeed is pulled in without getting CORs errors.
```
"local": {
    "domain":       "http://www.local.bbc.co.uk",
    "domainStatic": "http://static.local.bbc.co.uk:1033",
    "pal": "http://www.bbc.co.uk"
},

"stage": {
    "mount":        "/Volumes/wwwlive",
    "domain":       "http://pal.stage.bbc.co.uk",
    "domainStatic": "http://www.stage.bbc.co.uk"
},
```

##Local URL after changes
http://www.local.bbc.co.uk/news/special/2015/newsspec_9518/content/english/test_results.html

##Data feed
http://www.bbc.co.uk/news/components?allowcors=true&batch%5Bremote-portlet-content-only%5D%5Bopts%5D%5Bid%5D=general_election_data/uk_data

##Building the project

```
grunt translate
grunt images
```

Make images responsive

```
grunt images
```

Build World Service version

```
grunt translate
```

## iFrame scaffold

This project was built using the iFrame scaffold v1.6.2

## License
Copyright (c) 2014 BBC
