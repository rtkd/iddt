#!/bin/bash

curl -X POST -H 'Content-Type: application/json' -d '
{
	"user"	: "",
	"data"	: "facebookcorewwwi"
}' 'http://localhost:1025/store/packet/'
