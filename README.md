### TOR Hidden Service Mapping - Control Server ###

Part of a project to find the hash from "3301's Liber Primus".<br>
<br>
Accepts Hidden Service Descriptors and requests for Hidden Services.<br>
Calculates Hidden Service URLs and matches SHA512 and Whirlpool of FQDN and PQDN against the known hash.<br>
Makes real-time statistics available through an IRC bot, and triggers alerts (IRC, IFTTT) if hash is found.<br>
Provides an interface to access data for subsequent stages (service discovery, markup collection, markup evaluation).

#### Note ####

We discovered about 300k unique Hidden Services within one year.<br>
Many were not responding to subsequent requests.<br>
At no point in time did we interact with binary data or try to exploit found Hidden Services, nor do we condone deanonymization or hacking of Hidden Services or their owners/users.<br>
None of the URLs matched the hash. There were no signs of 3301 within the colleced HTML.<br>
<br>
https://github.com/rtkd/idclip/blob/master/log/.log