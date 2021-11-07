#!/bin/bash
# run - this script enters a infinite loop to ensure that the website does not go down if it
# hits any unexpected error that crashes Nodejs
#
# 2/13/18 Jeffery Russell

while true
do node server.js
done