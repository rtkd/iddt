### TOR Hidden Service Mapping - Command and Control Server ###

Part of a project to find the hash from "3301's Liber Primus".<br>
<br>
1. Provides modified TOR source for HSDir drones (not included in this repository).<br>
2. Accepts Hidden Service Descriptors and requests for Hidden Services that are handled by/pass through drones.<br>
3. Calculates Hidden Service URLs from descriptors and matches SHA512 and Whirlpool fingerprint of FQDN and PQDN against the provided hash.<br>
4. Makes statistics available through an IRC bot and sends out alerts through IRC and IFTTT (SMS) if a match is found.<br>
5. Provides an interface for dumping URLs for subsequent stages (service discovery, banner and markup grabbing and Elastic Search (not included in this repository)).<br>

#### Entry point ####

https://github.com/rtkd/iddqd/blob/master/liber-primus__images--full/73.jpg<br>
<br>
Translation:<br>
<br>
AN  END. WITHIN  THE  DEEP  WEB,  THERE  EXISTS  A  PAGE  THAT  HASHES  TO 36367763ab73783c7af284446c59466b4cd653239a311cb7116d4618dee09a8425893dc7500b464fdaf1672d7bef5e891c6e2274568926a49fb4f45132c2a8b4 IT IS THE DUTY OF EVERY PILGRIM TO SEEK OUT THIS PAGE

#### Note ####

There has been a lot of internal debate whether "page" as mentioned by 3301 refers to an URL, the Hidden Service markup, or another page (binary file) from "Liber Primus". Also the clear distinction between "dark" and "deep" web (is the "dark" web part of the "deep" web, or are they separate entities?) was discussed frequently.<br>
<br>
We came to the conclusion that "page" most likely refers to a binary file hosted on a TOR Hidden Service, but we would not engage with binary content due to the moral and legal implications this would have.<br>
<br>
Rather we decided to deduce the existence of the "page" from clues within the gathered markup (prime numbers and alike within HTML comments as provided by 3301 in previous puzzles) of the root page + 2 levels down.<br>
<br>
During our approximately 1 year running attempt to find the hash we collected about 300k unique Hidden Service URLs.<br>
Many of them were not responding to our subsequent requests, and it is interesting to note that shortly after we deployed the first drones there was a massive uprise in Hidden Service numbers.<br>
<br>
https://metrics.torproject.org/hidserv-dir-onions-seen.html?start=2016-02-01&end=2017-02-01<br>
<br>
Whether this was related to our doings or can be attributed to botnet activity, we don't know.<br>
<br>
All stages of the project followed a "fire and forget" policy. This sadly meant we didn't notice the server handling the requests for Hidden Services prior to passing them on to this server went offline shortly after being deployed, and thus we "lost" a number of possible targets.<br>
<br>
While collecting we had to find a workaround for servers deployed by Amirali Sanatinia and Guevara Noubir to specifically twat snooping nodes within the TOR network.<br>
<br>
https://www.securityweek2016.tu-darmstadt.de/fileadmin/user_upload/Group_securityweek2016/pets2016/10_honions-sanatinia.pdf<br>
<br>
We did not go unnoticed and most of our early drones were picked up. At no point in time did we try to exploit found Hidden Services, nor do we condone deanonymization or hacking of Hidden Services or their owners/users.<br>
<br>
https://arstechnica.com/information-technology/2016/07/malicious-computers-caught-snooping-on-tor-anonymized-dark-web-sites/<br>
<br>
Since we figured none of our actions was time critical, and drones would lose their HSDir flag once they were picked up by the "honions" we simply increased the interval between mapping Hidden Services and grabbing content while deploying even more drones.<br>

#### Result ####

As anticipated none of the ~300k gathered URLs matched the provided hash.<br>
Looking for clues within the returned banners and markup proved to be quite laborious and did not result in any leads.<br>
This does not imply there weren't any.

#### Project Sonar ####

There is a massive database of every box that is returning data on port 80 provided by Rapid 7.<br>
Data is available from 2013 up to now. Maybe the "page" can be found somewhere in there.<br>

https://scans.io/study/sonar.http