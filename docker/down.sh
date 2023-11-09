#!/bin/bash
set -e

if [ -z "$1" ] 
then
	docker-compose down
else
	docker-compose rm -fs $@
fi