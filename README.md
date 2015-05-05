# newsspec-9518: 2015_election_results_map

2015 Electiosn results map

## Getting started

Set up the project

###Update your env.json
You must update your env.json to match the values below. This is so that the the datafeed is pulled in without getting CORs errors.
```
"stage": {
    "mount":        "/Volumes/wwwlive",
    "domain":       "http://pal.stage.bbc.co.uk",
    "domainStatic": "http://www.stage.bbc.co.uk"
},
```


```
grunt
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
