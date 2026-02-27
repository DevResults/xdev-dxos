import { makeClient, type Client } from "../schema/Client"

const clientCodes = `
2scale
aba
abt
acdivoca
advancingnutrition
aecom
asiafoundation
aspiration
bao
cartercenter
centerdei
cepps
chemonics
childfund
chisuprogram
cipe
civicus
cordaid
corpsafrica
corus
counterpart
crs
dexis
eaa
eap
episcopalrelief
expertisefrance
feedthechildren
fema
gavi
gec
giz
globalcommunities
globalwaterpartnership
gmfus
gpe
greenclimatefund
guidehouse
heifer
helpage
hki
hrsm
ht
iavi
ibtci
iesc
ifaw
ifdc
ifes
inl
inlap
inlmexico
iri
jdc
johnsnow
jor
jsi
kenya
ksw
lab
lac
laces
lmh
mastercardfdn
mcc
mescla
meti
moz
mozaid
mtaps
mwi
navanti
nca
ndi
oas
opendoors
osf
palladium
plan
pmspiraq
primesource
projecthope
proximity
pwc
qatarfoundation
raleighinternational
relief
restless
ri
rootcapital
rti
rtieducation
rtp
sarep
shejehsalam
startearly
stdf
stopspillover
surges
syriamel
technoserve
uganda
undp
unhcr
urc
usaid
usfs-ip
usip
usp
verainstitute
wage
watermission
wcr
wiaam
winrock
worldlearning
worldrenew
wri
wvus
wwb
zam`

const sNow = new Date().toISOString()

/** Plain client data for use in tests */
export const clients = clientCodes
  .trim()
  .split("\n")
  .filter(s => s.length)
  .map(line => ({
    id: line.trim(),
    code: line.trim(),
    timestamp: sNow,
  })) as Client[]

/** Create DXOS client objects lazily to avoid issues during SSR/prerender */
export const createClients = () => {
  const sNow = new Date().toISOString()
  return clientCodes
    .trim()
    .split("\n")
    .filter(s => s.length)
    .map(line => makeClient({ code: line.trim(), timestamp: sNow }))
}
