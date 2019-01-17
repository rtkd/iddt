#!/bin/bash

curl -X POST -H 'Content-Type: application/json' -d '
{
	"user"	: "",
	"data"	: "facebookcorewwwi"
}' 'http://localhost:10101/store/packet/'
