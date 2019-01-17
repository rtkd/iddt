#### IDDT ####

Find a hidden service URL that matches the hash from 3301's Liber Primus, page 73.

#### Quick start ####

Clone and run the repository to start the server and IRC client.

```bash
$ git clone https://github.com/rtkd/iddt .
$ npm install
$ node ./
```

#### Available HTTPD routes ####

```bash
/serve/client/
```
Serves the client for auto install.

```bash
/store/packet/
```
Stores and checks descriptors and URLs send by clients.

#### Available IRC commands ####

##### client all #####

Lists all clients.

```bash
lb client all
```

##### client active <interval|date> #####

Lists all active clients within/at specified interval or date.

```bash
lb client active 1w
lb client active 01.01.2019
```

##### client inactive <interval|date> #####

Lists all inactive clients within/at specified interval or date.

```bash
lb client inactive 1w
lb client inactive 01.01.2019
```

##### client status #####

Lists all clients with specified status.<br>

0 = client is not sending<br>
1 = client is sending descriptors<br>
2 = client is sending urls<br>
3 = client is sending descriptors and urls

```bash
lb client status 3
```

##### client top <integer> #####

Lists top x most sending clients.

```bash
lb client top 10
```

##### service count #####

Lists loot.length

```bash
lb service count
```

##### service list <interval|date> #####

Lists collected services within/at specified interval or date.

```bash
lb service list 1w
lb service list 01.01.2019
```

##### service top #####

Lists top x most picked up services.

```bash
lb service top 10
```

##### hash all #####

Hashes all collected hidden service URLs and compares them to target hashes.

```bash
lb hash all
```

##### hash url <16 char domain name> #####

Hashes 16 char domain name and compares it to target hashes.

```bash
lb hash url facebookcorewwwi
```

#### Bugs ####

https://github.com/martynsmith/node-irc/issues/491
