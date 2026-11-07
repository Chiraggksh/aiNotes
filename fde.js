
/* work expected:

ai powered customer support system -> understand queries,search policies, access info, decisions, execute actions and explain why (grounding)
someting like getting things what it need, and then calling tools

5 things u must build:
1) data ingestion: company policies and general info, (publically available retail policies docs) and synthetic op records
   collect sources in pdf and csv, extract contents, split in chunks, store them with metadata, generate embeddings, index info for retrieval,retain doc name, page, useful info
   there should be working ingestion script that you can run again whenever new docs and records added with summary

2) retrieval and relevance: compare retrieval ranking approaches: keyword search (bm25), semantic search, hybrid search (keyword and semantic)
   u have to show which approach retrives good document, correct evidence ko rank kon krra h, how often are they in results, 
   use evaluation metrics: recall@k, pricision@k, mrr and answer faithfulness and groundedness
   means report deni h containing test ques, retrieved docs, ranking res and evaluation metrics

3) agentic workflow: results of earlier actions : an agent with access to multiple tool, conditional decision making, stateful execution, multi step, error handle explanation based on retrieved evidence
   like first finding whihc query it is, finding docs required for that tool calling, retrieve with mcp, evaluate outcome with policies, choose next actions (if yes next step and if not clarification), final response

4) mcp integration: business tools dena standard way: mcp implement include: input validation, missing order handle, invalid order, db error handle, app auth checks

5) test and observability: test cases bnao,user query, refund status, policy not in documents ese ques
   capture user query, agent actions, mcp calls, retrieved docs, as, execution time, model calls, token usage,
   test report bnao: execution logs, error case and performance measurements

   RetailAssist-AI/
│
├── data/
│   ├── raw/
│   │   ├── return_policy.pdf
│   │   ├── refund_policy.pdf
│   │   ├── shipping_policy.pdf
│   │   ├── product_catalog.csv
│   │   └── faq.csv
│   │
│   └── synthetic/
│       ├── customers.csv
│       ├── orders.csv
│       └── refunds.csv
│
├── ingestion/
│   ├── ingest.py
│   ├── pdf_loader.py
│   ├── csv_loader.py
│   └── chunker.py
│
├── retrieval/
│   ├── embeddings.py
│   ├── bm25_search.py
│   ├── semantic_search.py
│   ├── hybrid_search.py
│   └── evaluator.py
│
├── database/
│   ├── schema.sql
│   ├── setup_db.py
│   └── retail.db
│
├── mcp_server/
│   ├── server.py
│   └── tools.py
│
├── agent/
│   ├── graph.py
│   ├── state.py
│   ├── nodes.py
│   └── prompts.py
│
├── evaluation/
│   ├── test_cases.json
│   ├── test_retrieval.py
│   ├── test_agent.py
│   └── test_mcp.py
│
├── observability/
│   ├── tracing.py
│   └── metrics.py
│
├── ui/
│   └── app.py
│
├── reports/
│   ├── retrieval_results.csv
│   ├── test_results.csv
│   └── execution_traces.jsonl
│
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md


*/

/* lecture 1:

fde responsibilities: e com me users support query raise krte h, jse where order, wrong product, return product etc etc.....phle hote the support executives
                      simple ai chatbot bnate h yee hoga role apka.... socho kya schme chatbot chahiee ya sirf query theek krni h, kisi bhi time theek krrsktaa h
                      goal: reduce time to resolve problems without accuracy and trust

                      fir aap sol dhundte ho: jse rule based ai chatbot ki string jo match hori h to vo page dikhadenaa
                      but isme fixed set of options hote h...but u can have text but usme string zruri ni match ho so ruless ka tarika wont be enough

                      hence sol2: ml algo--> model bnae from data ki yee question aaara h to classify krr paee kiska question h refund ka, cancel ka, damanged kaa ya kiskaa trained on texts and questions
                      spam filtering etcc on labelled dataaa

                      now one thing missing is: ek accha response--> output b chahiee humanly sound kree not just classify
                      aisa model jo language generate kreee vo h modern llm ko use krnaa integrate krnaa
                      now can i return order in 15 days....but llm ko data kse aega? ki kya policies h apki company internal details etcccc
                      so llm to general gltt jwb dega hence we need to give it context of internal policies, user status, prev conversation now context agyaa ispee

                      ai chatbot bola but u thought off many thingss and problems etc
                      jo production ready sol bnega that is your responsibility....customer ke close kaam krte ho ap, understand prblem and build sol and put it to use

now ai history dkhtee h ab before genai:
   ques aya ki task machine krrskti h jisme human intelligence lgee alan turing....computers ka mtlb the calculation vgraa usi pe aai computer science...isme input clear the deterministic but kch jagah intelligence lgti h
   but human language is complicated ki...ques aya can machine think?
   
   mathematical aya ki kyaa machine kree ki aisa lge human ne bnayaa: alan turing test: human, machine, evaluator (talk by text) if evaluator ni bta paya to test passed
   chahee mimic krri ho fir b intelligence...gives convincing ans not necessary correct
   mccarthy used artificial intelligence term then boom kiaa yeee...

   intelligence to if-else loop bhi huaa to vo b intelligence h but behind the scenes vo to rule based ai h
   rule based me kch facts hote h jse returnable, order damaged etc and then ruels hotee h uske ki if returnable then nd all
   but main problem is natural language process krnaaa coz koi bhi json me ni daalta, rule based ismee fss jaata h

   eliza ek chatbot aya thaa...achhe se smjh pari h eliza puri rule based ai thi
   then rule based k bdd aee hum machine learning pe...rules to infinite hoskte h kyukiii...machine ko train krdooo ache se taki vo new data ko bhi ache se classify krr paee
   eg labelled data dogs and cats images vo parameters learn kregaa and then predict on unseen data
   unlablled me vo khud groups me dalta h and then predict....model is something a func jo input lega and output degaa and bss predict krtaa h
   limitations of ml: human intervention chahie bohot, more feature engineering, scale krna mushkil(dogs,cat cant work on humans face),

   patterns ko dkhnaa h tooo: compilcated problem jahaa insaan hi pattern naa bna paee complex hence do neural network eg support ticket urgent h ya ni to iske bohot parameters hoskte h: jse payment, urgent word, multiple times reached etc
   so we do x1,x2,x3 eseeee clumns h to z=x1w1+x2w2+x3w3 etccc millions of record do and then it adjusts weihts and khud se feature extraction
   khud pattern dkhtaa h yeee....ai->ml->dl

   but can dl process natural language? nooo bhamiyaa....jse images mee cnn...images me problem solve but text is little complex jse rnn/lstm but age context loss krdetee h
   msuhkil kyuu???

   human laguage me -- cntext, grammar, sarcasm, word order, culture, tone, earlier convo.....ek hi line ke multiple tarikee kehnee me
   subject verb, negation, interoogation...it kisko dkhraa h nd all, language is productive keeps changing

   phle aai statistical models ki train kiaa i like machine learning, students like machine learning , i like java to like k bdd predict kraegaa machine work solely on probability
   word change to prob changeee it is called n-grams....so ek word to bigram, tri-gram thodaa bohot change hoskta h but not necessary ki acchee se krr paegaa...thoda bht context aaskta h
   to many edge cassesss

   RNN: ayaa: koshish krii but llm ni bnpaeeee aaj kal ke chatgpt vgra vgraaa...process krleta h but context loss, seuqnce p kaam, lesss, repeat.....internal state change krtaa rhegaa
   so start vala context cheddeta h...

   llm eseee kaam ni krtee buttt....then came attention is all you need-> transformers concept
   jse rnn word by word and check hidden state but transformers chahee kitna bhi context ho, vo pura smjhtaa h and jse he,it,she vgra smjhne me context smjhegaa asani se
   hrr word ke sath relevance nikaalta h based on training and data jo isne seekhaa
   to relevancee yee based on learning btata h....transformer k bdd aae gpt bhamiyaaa time islie lgaa kyuki hardware b kam the,

   hence thats why called generative pretrained transformers
*/

/* lecture 2 : how llm work, tokens, attention , transformer

suppose line is i drink coffee every .... predict kroon suppose or data detaa rhaa to words kam hojaegee most probablee
jse i drink coffe before going to.... and if context dedia swe ka to school to jaega ni aisa kch hence word prediction increases
jitna chota context utna vo dikkt, jitna bda hence better words predict

llm b ese work: predicts next work it predicts next work based on context ...iski khudki vocab hoti h
llm internally usee neural network,probability on its internal vocab and then next 
more dpeth:

llm smjhte h numbers ko naa ki text ko....backend p jake text se numbers me krdeta h.....
cat, dog, apple, car eseiiii vocab hoti h llm ki set of characters (not word) ko uniquely idenify krtee h into numbers: set of characters ko convert krta h use kehte h tokenzier and jo tokens ki number generate hui use kehte h tokenid
llm ka kaam next word ni dkhna hota but next token

tokens are small pieces of sentences, hrr token p number without logic unique is tokenid and then it predicts ...ek word kaa ek hi tokenid same rehta h coz vo value nikaalta h
maybeki kisi data p same orr alg algg bnaee....algalg models apna alg alg kaam krte h

so tokenizer: line into token and assign tokenid yee h kaam iskaa....each word will be token sochee to bht word hojaegee paaji kch words jude hue hote h smartly ek sath hi krdoooo
so automatic, automate, etc same hi word h so rahter than word, it uses set of characters..latest models less tokens and hence rich vocab and more unique identify....what if hrr character ko unique token to kitne tokens jayeege gpt k pss jo tokenid hoti hh vo jati h llm pee....and in same order p jatii h
so llm needs both tokens as well as positions
and hrr token ka alg alg context me algalg meaning b hota h .....jse bank token (i deposited in bank), (i sat on bank of river) dono ka alg h...so token bnaegaa bank ko same number but fir b meaning algg

meaning kse dkhta h?
transformers and attention ko khtee h 

phle embedding smzoo: (vector embedding)...ek word h king to uske associated words jse leader,monarch,male etc etcc hence in sbkeee vsee hi meaning hote h....hence king and queen are related royalty,leader,monarch associated same bs m and f
but banana hota to sbka algalg association than kng...suppose 4 parametrs p describe kroww...to king ka usse association dkhegaaa jse royalty,food,living,tech probability detaa h not preset ansss
banana kaa b same parameter p algg point and probability aegaaa so in words ki vector embedding krdii hmneee
khudkee parameters labelled ni hote and thn vo in sbpee hrr ek token so whole internet h data p train, to jse jse word aegaa to predict krta rhegaa 

neural network attention model:
rohit gave aditya his laptop.....hence his k basis p algalg function bmjata h ki relation ksaa h words kaa issiko attention kehte h
attention means how tokens are related to each other - how tokens influence each other .....his word h to sare words k sath attention nikalegaa and probability score aegaa sbkaa combine kregaa scoreee not ki max dkhraa hogaaa

hence aata kse h: aata h Q,K,V theme:
jse sentence-> tokens-> id-> hrr token kaa embedding then qkv means 3 vector bnegaa for each token.....

qkv se pta lgjaegaa-> suppose on word h and tokenid 56 and then prob score dega with attention (vector compare): unka match zyaada aegaa eg the cat sat on the mat...on and mat ka relevance score zyadaa aataaa h
                      hence compare kse krogee ki word ka jo process hora h uski q compare with k vector of other words relevance score bnjatee h weights and then final vector bntaaa h in sbkaa z=w1*v(the) + w2*v(cat)...etc.etc
                      hence ye formula is done with deep learning to yahi function to thaa uskaa b is used fr normalisation....prob jiski zyadaa hogiii final z niklegaaa.....

ques: why 3 vectors ek hi vector me dimension bnadete: but hm algalg domain me dkhte h token ko chrag ka hota technicalskills, location based etc etccc hence token,query,value helps to find query dim usi ki trhh hogeee isimee
final z relevance bolte h self attention as same words

to hrr token kaa z vector bnaa hogaa apna apnaa self attention method se ....v1,v2,v3,v4 etccc hence transformer me attention bss ek component h
to neural network hotaaa h...isme multiple layers hoskti h connected with each other jo b output generate krtaa h
multiple layers isliee kyukiii dheere dheere highly context and mtlb smjh paataa h based on vectors generated jse 2 his  gets solved in aage ka layers

hence token-> embed -> pehlie layer qkv and attention and layer 2 me recent vectors as input and rel and then find result and it has understood abhi tk generate ni kiaa h
jse hi final layer phochaa tooo.....last is p pura context aata h pichel vectors kaa coz is p pura context h hence hfinal vector....dekhegaa to llm vocab me dkhegaa ki konsaaa zyada relevant h
scoree bnaa and logitss and jiska max ayaa and then new word generatedd and keep on doing itt same processs

scoree aata h softmax function ek porbability distribution dedetaa h tbhi pta lgta h max konsa h orr ye sb internally hora hotaa h

llm work: given the preceeding tokens, produce a probablity distribution for next token

kya same hi nikaalega br br?
hello how are u ee alg alg jwb deta h if same line p proba distribution krra h to word to same ana chahiee then why diff?

concept: sampling and temperature: greedy approach hoga to same reply aega,,, sampling me creativity ati h sampling mee 50 to phlaa pure 100 ko lottery tickets degaa and kis distribution ko aara h....hence random number jo ayaa to usko pich krlegeee
probability distribution jispe hogaa

to random number bhi koisa hoskta h hence isko enhance krne k liee temperature ata h
softmax se phle applied temperature.....if t=1 to same rehta...t=0.5 to 5,4,3,2,1 hojataa hmaraaaa 5/0.5 andd then 10,8,6,4,2 hence model sharpens the distribution  if temperature is 0 to fallback to greedy approach 
if t=2 to creativity bdhegii and then can result in anything logits ko closer dediaa and then random number koisa b hosktaa h to temperature hmaraa kam rkhoge tooo usi mee strict rhegaaa

even tho temp1 and sampling me b unique hoskta h 


*/

/* lecture 3: integrating llm with application

chatgpt isnt just an llm model chatgpt ke server p hota h raw llm, raw llm capability and genai application software built around that capability
jse guardrails, cheeze, etccc jo complete application chlne dete h
tokenzier vgra backend p hota h not by llm...fir vo llm p jata h 

weather rn hora h to yee ksee dkhpata h, so rawllm ni dkhsktaa kuchhh so chatgpt server check krta h with tools ...raw llm se btt krni h to platform.openAi.com/chat ya fir apikey with postman/applciation
so external tools ni use hoteee 

meehnga or cheap models: based on token req and response
hrr ek model ki cutoff date hotii h: final date jb train hua tha
raw llm calculate b ni krrskta unless vo tool use naa kre therefore gpt sahi dedeta h rawllm ni krr paataa

eese tools like : calculator, weather api, compiler --(nu of stars mee b llm false, but gpt sahi dedetaa h coz llm is just used for prediction thats it so gpt is uses compiler to give so llm code dedegaa ad thn compiler gives the ans )
llm ko kse pta konkonse tools ka accesss h and then decision kse lega?: reasoning is done by llm
so llm natural lang ko tools ke according change krta h and then takes response and sugarcoats it

so counting stars me generate krdega number of stars and then gives output so llm is used for language reasoning
so new data ka b access milskta h use using searchingg internet

what if khudka code: to llm tools use ni krskta..hence hmee logic dkhna pdega
do by postman: apikey -- direct llm se btt kroge to token more, apikey tells auth, who is person and how much topup left....
platform.openai-> generate api key krowww ...free me openrouter get api key bht sare models

postman p gye: openai url yaa kch bi post me-> api key in auth bearer token -> body me jake raw,
json type mee: 
{
 "model":"gpt-luna",
 "input": "question daalooo and all " response aegaa so it tells reponse 
}

memory maintain krne me b tokens chahie hotee h ab ismee phle name btaoge and then u ask what is my name to bhuljaega vo coz memory hi ni rahiii 
phle do with application: postman p jaake text dedooo 
but what if kuch orr pucha jaee usse jse 2+2 to ni dena chahiee  useee (hence system prompt me pdhoge)

user: prompt,call and content

*/

/* lecture 4: first ai chatbot: context window, memory, hallucination

means message to message koi context ni rehta, to kse rkhskte h hum context ka....
llm ni krta context store phli btt....purana msg chlajataa h....ki mtlb hrr ek response and question dono cheeze coming and going to llm they are first getting stored in a storage
and jb b response jara ho to storage b jariii hoo....can store in db,cache,in memory etcc

roles ka kaam ata h: userrole and assistant role....and user and assistant ke dialogues k basis p store hoge dialogues/responses
first base k lie in memory cache ke through....
now koi chant bnda aya and kch orr puchlia explain docker...which is not even relevant to faltu kaa kch naa ae....to ek orr logic....ask if beyond to no replyy aisaa kch

issue kahaa h fir? the thing iss aap apne function me chat and llm ko bhjne se phlee itna bda prompt bhjre ho just to see if beyond capability and professional h msg ya ni nd all..hit and try kia prompt to dikkt degaa bhaii
thats when your system role comes

user and assistant k sath system role ki priority high hotii h : who u are and what are your roles..llm ke next token generation ko context diaa h new
system role me zyada prompt ni dena hota 4 responsibility: role,task,behaviour,constraints
kch chances me fir b fail krrskta h llm will always be non deterministicc

so genai hi history maintain krtiii h....

now what is context window: prmpt me jo di h info: context window= input token+output token..llm process krrskt h ek msg k andr
llm ke parameters algg, context alg....kitna process krrksta h using attention hence permanent memory ka part ni bntaa store.....
prompt se llm model train ni hota: prompt bss new msg generate krta h

history bhjoge list me to with time context window bdh jaegii thenn?
jse jse chat kroge to no of tokens bdhte jaege....hence u can do optimisation

puri history ki jagah: start n msgs, or last n msgs, or first m+last n msgs....sbse best tarika inme h summarise text g bhjna h to abcdef ko compress krkee
summarise me dikkt bhaii yee h ki model sari info ni rkh paegaa hallucinate kregaaa

so hmesha relevant infoo bhzo not ki hmesha lambi, so llm ke responses b bdlskte h based on context as it work on previous text....
context a: context b: same hi btt algalgg btaega if fresher and senior eg

means token apna temperature p hi ni balki context se bhi change hoskta h.....chatgpt previous chat kse dkh paaata h: it is not remembering but vo rag kaa use krtaa h not this hence most optimal is RAG,

chatgpt streaming krta h: word by word hence chatgpt ka server b wait kyu kree vo b bhjta rhegaa.....hence streaming bhi krrskte ho ap

hallucination: llm sounds confident even when they are wrong: llm ka kaam tha next token predict krna
uska kaam db se validate ni h but yee ki word p dkhegaa and then gives results....manlo enough info ni h to koi aisa dedegaa jiska less info h even if prob very less but baakiyo se zyadaa fir b hallucination mode agyaa h
hallucination reasons: confident sound bcz trained, limited info, training data internet data less,

hallucination htane k liee: rag,memory, validaiton, guardrails hence fir b hallucinate kregaaa

code: message,call(),content () abhi tk message ki jagah user bhjre thee hum 
      system prompt bhjn k lieee chatclient().prompt().system(system_prompt)
*/

/* lecture 5 : AI AGENTS

suppose u say to write make me a website to jse chatgpt krdeta h to u can also do in your app, rather than just giving answers
llm takes input tokens and give output tokens.....transformer predicts next token and all

it can just generate output kch action ni krrskta.....so it will need tools so llm to sirf code deskta h bss thats it...
what if llm ko b capability dere h.....hence it uses tools....to app tools ka access dete ho ki koi aisa question puche to aisa krio, aisa quesiton puche to aisaa

to llm natural lanauage se smjhega ki yee to ni krrskta so it will call tools....to call kse krega? these are normal deterministic applications/code
llm call krega ek structured tarike se....coz those functions will expect thta only
to can use multiple tools sequentially to give answers 

llm ko bss ye btado kon konse tools h uspe and howfunctions expect data....
so non deterministic works with deterministic one....this is called ai agents
seee code clearly....understand everything

tools jb bnate ho to description b dedo so that llm smjh jaeee konsa kya krra h ..calculate(operation,a,b) and param me bhi daalskte ho description apni natural language me daalskte ho
tool param and tool description dalte ho...system prompt daalte ho..

ye tools ka access system prompt m dete ho ki ye tool h....send system prompt and tools(obj pass krdena)


step: user query-> server-> llm k pss-> tools access-> model respond with tool access-> history dete ho, system prompt, tools and all-> llm decides ans

tools types: info tool (giving info), action tool(sending email)
llm+tools-> workflow ....agent tb khegeee jb complex hoe and multiple tools and sequence hoee aisa kch

agent tb khege jb yee sb ho:
goal-> create website
decision maker-> llm model
action -> work tool perform
env-> jispe action performed
observations -> is it correct?
loops -> what should it do next?
  
observe kse krega llm model: suppose check kregaa command line tool h to phle folder bnaega and then check....
hence comes security point of view: aisa kch naa ho toh we run in sandbox ki jo b run krna h isi mee kr...createdir,file,write and readfile yahi 4 tools h iske alvaa orr kchni krrsktaa paaijaan

chatgpt style streaming:

*/

/* vectors and embeddings explained: 

batman ko leke bht wordss aajate h..computer ni smjhta vo bs numbers smjhta h...computer naa tokenid smjhta h
if 3 words: batman, superman, banana so how do we check konsa pss pss h to computer to ni krr paega as use meaning ni pta

exact identity matching: strings equal h ya ni aisa kch...but aisa bhi to hoskta h ki sirf strings ni meaning b smjhe...(semantics)
ml models b meaning ni dkhskti but mathss krrskti h....computation ache se so first attempt failed when we gave them random numbers

second attempt: jse movie recom h to movies and action k basis p score dediaa....scoresss deerkhee h sbko....ya categories
score dene ki vjhse recommend kia jaaskta h....based on domain....score ko dkhkee can easily find similarity bw words jse avengers and batman.....so action magnitude,,,,dediaa ye ek approach achi thi
so random words ko ek proper meaning dedia....using difference distance

but titanic is also 2 and hera pheri is 2 on action to inko same dedga..but zruri thodi titanic similar ho isse related
sirf action k naam p storing not that enough .....parameters bdhadooo
so [a,b] and [c,d] aisa hgya to u can do dot product....or 2 hi pts h to distance formulaa...

inhi collections to kehte h vectors....order imp....alg parameters hence ye sb b recommendation engine me help hota h
to vo vector ko jo vocab me check krke logits bnata h to ye vectors tbse chlree h....jis plane me chltee h now it is caled vector space...

3 tarike to check vector kse similar: euclidian distance, cosine, dot product
kyii br euclidian not enough: user a=1,10 and user b=10,100 to euc glt degaa as alg alg space me h yee but ratio to sahi h.....

fir ati h cosine similarity: a.b/|a|*|b| dot product / magnitude of both ki direction same kahaa point krte h....-1 se 1 hoti h cos value.... 1 if same dir,0 if unrelated, -1 if diff dir
cos similarity abs diff ni dkhta....dot product dono p focus: angle and magnitude b dkhega..... abcostheta
depend on application konsa dkhnaa h.....

but similarity uspe b matter krta h decision dimensions kyaa h kahi action ki jagah u are taking characters count vgra vgraa

inhi vectors ko khte h handd crafted vectors coz ye hmne khud bnaii...ml me phle krtee h ese...isi ko kehte h feature engineering historically ese hota tha
but prob1: how many dim
prob2: feature depends on problem
prob3: natural language: context change hote hi vectors change hojatee h 

king,queen,banana insbke domain alg hogee and all diff dimensions faltu ke dim rkhne pdegee....khudse vectorization is tough hence ap khud krdoo...
vector bnaalo and comparson krloww khudd hmeee to bss similarity se kaam krna h naa thats it...

numbers will be parameters learned during training.....seekhta kse hoga: 4 hi words h vocab me to vo random assign krega...parameters change krtaa rhegaaa
objective dia jata h unko fulfill krne me check krtaa rhega....
bht sare sentences dikhate ho ap and then association lgane lggjata h model llm parameters...parametrs build or generate embeddings
laden kaa mtlb ni pta lgega but sentence se smjh ajaega.....contexttt smjh jaata h yee firr dkh dkhekeee

so random vector-> goal diaa ki use them to find similarities....training data p right ans hota h to jo usne bad ans dia to loss function check krega and then learn adjust parameters
this is how llm trains...krta rha millions and billions of time.....and it trains and machines learns and create embeddings 
to ques is kyaa usne jo dim hogee uska meaning hoga? ki action dim, comedy vgraa ans is noooo

llm parameters adjust kregaaa...koi semantic meaning ni h ki ek particular elment ye bolra h
inhi ko bolte h embeddings....training kregaa...vector embedding hota h rag mee ....
embedding model is something ki input du too uska vector bnadee ki predefined dim ka vector bnadee bsss
*/

/* movie recommender system

brr brr llm call ni..embeddings and vector use

embedding model and llm are same? no yee same h kaafi jagah-> tokenize-> neural network-> attention -> transformer....then diverge
llm goes to next token generation.....but embedding model embedding model detaa h
so embedding model is intelligent toooo

llm b krrsktaa h bhaii....movie recommend but we dont want generic 
but aisa b krskte ki koi b ek movie dedeee from given....but yaha b context (large token waste ),

but best is sbhi movies ke description ka vector bnale and then ese hiii query ka vector bnaoo and then check krlowww konsaa sahi h konsaa nii simpleee
isi ko kehte h pre computation....hme also generation ni chahiee so llm no need
it is overkill and over engineering tool....problem solve using good dimaag

ek brr pre computation kroww db me store --> then query kaa embedding again and then find similarity list me store, sort and top 3 aisa kchhh
movie name aegaa movie list me se...embedding fetch and then check and compare like above method...isme to koi embedding bnane ki zrurttt niii

movie me movie description provide kroww taki better vectorr bnee and more descriptive....cosine check krnaa
but irl me orr b cheeze complex recom bnta h : history, ratings, other users etcetcc
 
*/

/* why do we need vector db
 
problem: abhi tkk khudki memories krre the hum.... but search krna is bht tough
ques is store kaha kre and efficiently search kaha se kree....

relational db me daldete h fir normal dimaag khega.... id,name,description,embedding etcetcc aisa b krskte thee (serialise,json,binary value)
but sql works on exact matching not like vector checking...but vector doesnt work like that
sql me indexing b lgii hotiii h 

u cant even check with vector embedding ki equal ho to b same hi dega bss.... 
hence vector db works on similarity matching (top3, top5 vgra vgra) but others work on exact matching

id,embedding k sath sath orr cheeeze b store kroge metadata form mee name,movie etcc....word se embedding bngya to embedding se source tk ni jaaskte hence unhe b store krna pdegaa metadata

so query aegii-> embedding bnegi-> similarity bnegii from all vectors phle khudki memory thi but now its our db...
sql me to indexing h to logn legaa but vector db logn lega ya linear...abhi tk hum knn krre h ....linear search hota but isme dikkt aegii bhaiiji....
100 million comparison bhott dikkt degaa.....nd hrr ek ka bhot comparison

cost of 1 query= no of vectors* dimension of each vector
storage me 1 vector leta h 6kb...vgra vgraaa so yee b problem h tc and sc kii
sort b krna pdegaa to orr tc

one modification in tc: ki irrelevant movie ko to check hi mtt kroww 
sql me indexing me binarysearch lgta h to kya isme b lgaskte h?....1d me to chalo dhk paoge bs lgakee ki pss vale yee lgege but with more dimensions u wont be able to coz of curse of higher dimensions
2d hoga to ese krskte x me dividee and then y me divide...means 2d coordinates ho to x se sort....and then mid and check and phlee layer apply with y...
this is called kb tree....multidim me binary search treebnalo ese divide krte krte 

and then apply bs root se check and dis cal krte rhoww....x se and then every layer y se and then x ...left es right gye to discard krdiaa left portion but zruri ni left valee hmshaa door hoge...so not that optimal
2d me problem when boundary me closeee ho.....to boundary me ho x and y (left and right) dono part dkhogee.....k dim tree 

steps: search side of query-> keep track of dist-> cal dis of query from splitting plan.....if dis<best dist from splitting plane then search other side else prune other side
so ye to brute force hi bngyii paaji.....hence not optimal

curse of dimensionality ye ni ki ek dim bna to ni hopaega bsearch  but more pssible ways to cehck and then more tough 

solution::
vector if eg 2 dim h....isko bolte h ANN....approximate nearest neighbour not k nearest neighbour
to ap approx hi dete ho nearest jitne b h unko daldo..thodi bhohtt quality khrb hogyi to b koi load ni...ans to aara h naa paaji and even dataset ko acche se theek krdetee h
100 million se 1000 vectors space ko km krdegeee ye....

kispe kehskte h ann acha h ya khrb h:
knn hoga to...sure shot dega but ann vala dikkt dega....recall@10 10 results me kitna dera....8/10 kitna sahi deraa h 80%....
jitna recall krna chahogee....utna vector space bdhegaa....and utna hi tc b bdhegaaa so tradeoff h yeee

ANN uses algo:

IVF: inverted file index: vector ko rep krte h to similar vector pss hoge and not similar door door hoge ye to pakka h...in sbko naa cluster mee breakdown krloww...in eg 100 million vectors me 1000 cluster bnaalie...similar movies kee
     user ki query aai or embedding krii to ivf mee vooo....closest cluster dkhegaa....isi cluster mee se top k nikaal dega...
     pss vala cluster dkhte kse h : use by centroid....central part bht tarike h k means algo ki trh....hrr centroid se compare and then closest centroid aaya and thenn....ismee top k vectors ko return krdegeeeee
     clutering hmnee phlee hi bnaadi hogi yeee ni brr brr bnaee jaare h

     isme ans to ajaegaa but problems h koi: aisa hosktaa h ki cluster dusra choose krleee and cluster 2 mee bht close h query vector ke....and then cluster 1 se hi result nikalaa cluster 2 rehhi gyaa to dikkt aasktiii h isseee
     aisaa krrskte h ki top 5 clusters dkhloo rather thann....thiss one clusterr tradeoff h bss


and HNSW: hierarchical navigable small worlds: cluster mee mt maano but graph ke nodes maano and ki edges se jude hue h....
          to q query vector h to a ka distance nikaalo eucliden and then neighbour ka nikalo....then b p jaao kyuki b kaa ezz pss h to d close to ese jaate jaaogee...similar like dijikstraa algoo
          sbsee kam e kaa distance ayaa tooo shortest node p jaata jaega....dense graph zyada hota to brute hojatii approach....

          roads network b jaante ho...tooo small roads and expressway... zyada better h and galiya isliee coz precision high h inn sbka....
          a->b->c h to hops aapne htadiaaa and direct expressway dkhliaa....if think hops zyada hojaee dense one me...

          so overall picture: max hops se hatooo if distance km hora h to uper vali layerr kaa and then u shift to next hop and then if dusri ka zyadaaa ara h to usi p rehke uske niche layer p jake same approach lgaooo graph distance valiii
          jo aakhiri h to vo layer ka node dedegaaaaaa bss thats ittt

          (to be continued)


*/

/* RAG 

 we knw memory vle part se ki memory bnate bnate context window bhr rha tha brr brr as pura dena pdraa tha....so we can use RAG 
 tho ye problem naa bhi ho generic prompt degaa so u did system prompt.... 
 but llm ko internal policies ksee ptaa ye to generic ni h naa: hence u think ki provide krege system prompt me but usse bhtt bda hojaegaa.....but system prmopt zyada hojaegaa
 hallucinate krtaa h prompt se....

 HENCE CAME RAG:
 chunk kro-> vectors embedding bnao-> query vector and then compare.....pdf form me bnayaa, resultss aegaa....and then sent to llm so that ache se language generate krr paeee
 prompt, system prompt, context (metadata) so vector db ache see krdegaa

 zyada pdf kaa vector bnaoge to context chutne lgegaa so u do chunking
 one cheezz jsee ..........refund policy is iska ek chunk bnraa h and aage anss aegaaa kchh....so hoskta h llm glt info le and hallucinate kree and hence u do overlapping with chunking
 so that not hallucinate....

 random bnaoo pdf filee....knowledge folder me....func aisa ki vector db me dalde...read all, chunk, vector
 pinecone vector storee liaa hmne..
 use openai embedding model, pinecone db and openai llm model thats it

 vector db me vector k sath sath metadata b add hoga kyuki vahi to retrive kroge naa paaji....
 so just give system prompt (isi ke andrr retreieved embeddings),user query thats itt
 vector name mee index name and namespace k form me storee krowww
 db me jake index createee krowww

 demn mann....u can do thiss thingg ezzz llm ke tarikee see

 ADVANCED RAG:
 problem: socho kch general doc ho, kch electrnic specific, kch damage specific....vgra vgraa or agar damaged headphones hoga to embedding model smart hona chahiee ki electronic
 phlee hi btaadee.....and llm bhi smart hona chahieee....

 as a developer hmara kaam h doc fetching prob zyadaa hoe...: 
 1)llm p sahi context hi ni phocha kyuki..
 2) maybe llm ne hallucination or over info ki vjhse glt info di
 
 system prompt change krke fyda ni h itna, 
 simple rag: ques->embedding-> similarity search-> top k-> llm -> ans

 so some techniques:

 1) chunking: if bdaa vector se rep krtee to sari btt ni keh paega and unrealted info,general hoga... 
             fixed sixed chunking: but isme context loose hoskta
                                   so solution is overlapping
                                   how to decide overlapping: hit and try...general: 400-600 tokens ka chunk and then 10-20% overlapping

             structural chunking: title,heading, sub heading vgra vgra structured chunking krr skte ho
                                  based on title, subheading vgra vgra paras, sections k basis p
                                  isiko khte h document aware chunking
                                  just change into docsss

             semantic chunking: socho return policy ki btt h and shipment h in other para...so hoskta h ki ek me ajaee to dikkt hojaegii...
                                ye hota h line by line me divide-> check similarity score of vector of each line-> chota chunk me dikkt rehti h bht context loose, top k me dikkt, vgra...so u check cosine similarity with each other and mergee tho a lil time consuming but better idea
                                so yee apko sochnaa h cheezo kooo 
                                sweet spot, na zyada chote chunks naa zyada bde chunksss

 2) retrieval techniques: ki chunks kaa retrieved acha araa hoooo
             top k technique: kitna k rkhree ho decide kese krogee: if sb realted data h to k zyadaa krow, and iff unrealted h to kam hi rkhoww
                              mtlb sweet spot chahieee dkh dkhkee ki ksee araaa h...
                              irrelevant info: contextzyada, halucinate
                              hit and try phle 3 rkhow and then aage check kroww jb b lge irrelevant chunks aare h to k kmm krloo simpleee
             
             similarity threshold: ki koi out of the context dediaa ques and then system prompt ko chakma dekee kch orr puchlia to top k return hogee...
                              threshold dkhlow ki top 3 uss threshold se uprr hona chahiee vrnaa ni....faltu ques se bch jaegaaa phle hi print kradooo
              
             metadata filtering: vector k sath metadata store krte h hum...to metadata k hisaab se hi info check even if ivf and hnswalgo usehui h
                              electronic metadata k basis eg
                              .filter logic se dkhste ho category=electronics to app chunking k time krrskte ho document jb form krre ho to metadataa daalskte ho....
                              khudse kse ptaa by document name.....doc ko section me divide to section name....
                              ki question puchne se phleee ctegory choose krloo and then search bar open kroo and then category and search bar agya and then u can change....
                              others ara to not this methoddd

                              aisa b hoskta h ki jbb alg alggg name se quesiton h too....semantic meaning se dkhskte ho yaa fir specific product se simple keyword deekh skte ho
                              keyword search main ni hota....hence u can do both user uery me keyword and semantic search both
                              keyword search (bm25)
                              semantic search 

                              to dono ko consider kroww, RRF tarike se reciprocal rank fusion....rrf(d) kehta h ki rankk nikaalo kitne types ke krre ho search
                              hrr doc kaa rrf nikaalo (ranking) 1/k+rank(id)...submission iss

                              jb ap reranking krte ho:
                              sare document retreive kiee butt top dkhnee h to ranking lgaoo....
                              reraking algo lgatee h....abhi tk query independently chlre thee but noww u can by doing sath mee
                              
                              user ki query and koi b document lega....--> sath me pdhegaa (embedding ni bnaega)and then return relevance score of them

                              rag ki vector embedding....retreieve krlo vector 10-20 top and then reranking model...and then return top 3 to llm
                              if simple to llm use krrskte ho yaa fir model

                              reranking tbhi jb bhott zyddaaa documents ho....if results complicated ho to

*/

/* structured outputs in llm

llm token se output bnata h out work: kse hm llm se structured outputs bnvaa skte h
koi b cheezeee ati h to structuredd ati h jsee json (predefined way)....

ki aaj k time p aap form na bhrr rha ho, to best iss form me natural language bhjo, llm smjhega and return structured output,
and then it gets sent to server and returns and does the work
zruri ni json  but xml ya kch b so just give structuredd

aiagent b yahi krra thaa ki tool kya lerha h expect: then llm was responsible for decision making, work, tool nd all
but ab server kaa logicc h voo...so noww abhi bss responsiblity yee h ki structured output do bss thats itt nothing else...aap khudse schedule ni krre hooo

llm ko btaee kse: 1) either system prompt ki string ko json me krdenaa but llm ko schema k bare me kse pta lgega....so wont work also variable change
2) objects match ni krege....jo server ko chahieee ki variable h kya name se chahiee or variable ka datatype h kya actuallyyy

llm me krskte ho but sudhaar: ki client sb kch naa btaee like 5 details puchi ho di sirf 2 2 choice: if ni milti info too yaa blank chdh denaa ya fir dobaraa puchloo

but hm same cheezzz system prompt me b to bhjskte ki ye fix h isko dkhnaa: to zrurt hi ni thi structured ki
system prompt never 100% reliablee bhaiijiii...system prompt me map krdenaa....ki isi schema me map krna....

llm ko behave ni but ans map krdenaaaa.....
meeting details bnaii (actual) 
system prompt me ki is value ko dkhna, na ho to ye ye khudse ni to blank krdenaa
.entity map tarikaa and system prompt me bss ye ki extract krde bhaiii yee ho to ye krna and all
sudharne k lie history response store kro in model chat, system prompt me puchlo and then ask again
or either preme sari info leloo phlee ai ka alg function and then only calls this one functionn vgra vgra...jb sari details aajayegii

*/

/* all about mcp

abhi tk we know about tools: server p jata h query and then llm if ni krr skta to vo tool deta h
to llm tools se btt krega to structured outputs me hi btt kregaa yee pta h hmee 

llm directly api ko ni bolta vo server ko bolta h and then server se data ata h and llm p jataaa h

but inke sath problms:
suppose server bdh jae 3 apps...server me apna apna llm, and teeno mee tools dalne pdegee client can use diff diff and microservice ki trhh
tarikaa ki aisa kchh...ai tools likhde alg server p...adapters bnane pdegee....jo chahee koi bhi server ho aitools ka ek hi server ho so that code brr br naa likhna pdee
so u have to make proxies.....

so if 10 tools and 5 server to n*m adapters bnanee pdegee....fyda ye bhi ki algg alg rkhkee bd me add bhi krr skte ho

isi ko solve krne k liee mcp: model context protocol
protocol is rules

protocol that helps ai app to talk to external tools....

mcp server and mcp client
server jahaa ai tools exist krte h, sare server llm part jo tools use krre h use kehte client

so server mee server+llm+mcp client hota h and teeno kaa kaam mcp server se interact krna and data leke aana
server+llm ko hum bolte h host so overall mcp client, mcp server, host

todo task: tools ki zrurt pdegii orr bs ai tools ko alg server me rkhrhee h

so overall picture: server p req aegii to llm ko btate h ki konse tools ka access h yee btata h mcp client sb andrr se handle hojatii h
                    mcp client takes tools from server with description-- response dega in particular format in structured output
                    full json way mee aegaa anss
                    isi ko boltee h service discovery

                    then llm ko data provide krte h hum-- now llm model is aware
                    so query aegii server p ...llm ko pta chlega tools use kregaaaa
                    so llm structured input degaaa to server
                    llm server ko dega...server mcp client ko dega and send to mcp server to execute task

ques iss normal rest api hi krleteee...same chlega bhaiii but isme khudse execute krni pdtii but hmne standard arch bnaadia....
mcp client khudse tools lelega and return krdegaa llm ko
standard approach.....mcp k andrr rest api hoataaa h useee 

mcp server sirf tools ni but also resources and prompts...tools to pta h but resources is something ai to know something related to RAG, prompts ko store kyu krna?: reusable instructions for ai
llm khudse store ni krr skta hence we need resources for itt...mcp server me sari internal policies ari ho.. rag integrate krkee kaam mee lee ao mstt
mcp client ko bhjne se phle server bhaiyaa smjh jaegaa and responsibility sb host ki hi rhegi

code: tools/list ko call krlegaa...call krne k liee tools/call
      mcp server ki dependency chahie...and tools me mcp tool ka name and description dedoo for every function iske sath sath input schemaa
      mcp tool param

      so mcp client apne server se kse kregaa bt: default url is 8080/mcp and it is stdio (local config ka part)
      and alg alg server p deploy krte h so http lgega streamable http use krtee h 
      client jb bnaoge to mcp tools ka access dega in chatclient...seedha mcp tools daldiaa khudse kchni kiaa


*/

/* how to test ai applications:

we knw ai applications are non deterministic to evaluate kse kroge:
deterministic me to test cases hote h unit test cases vgraa...specific input me specific output

but llm me to alg alg responses aa skte h...so cant compare strings so semantic meaning smjhnaa pdegaa
llm model se ye expect ni chahiee ki exactly same result as porbabilistic, but it is jo hum chahte thee vo ans dee

ab hme bht queries aegii to manually to check krege ni--> system prompt change, model change p brr brr dkhna pdega chunk size in rag me change, top k bht scenarios like temp change, tool add/remove
ai app behave krr rhi h expected way me?

ai evals: systematic way of measuring if ai is behaving how we want
          bss broader way as non deterministic
          jsee input hogaa to must mention 30 day return window...to if ans ayaa to ksee kregeee

          then we will do evaluation on basis of some parameters

          we need test input-> expected behaviour (what shd be mentioned, agents me tool caling, rag me retrieval, or structured)
                      -> evaluation kse krogee: 
                      codee to check if match hojae (not whole but some scenarios)
                      if not then use second llm (llm as a judge)
                      normal human team

          sirf llm ni but puri application check krni h

          first thing inpput: evaluation dataset (set of questions) question same rehna chahieee and golden dataset (questions and answers bhi miljaee)
                              agents ho jse calculator: expcted tool and expected argument bhi hoge and expected answer tb khegee golden dataset
                              rag application: questions, top k kya, llm ans
                              structured: questions, exact schema

                              bnaegaaa kaun: start me developer then bdd me live user queries

                              dataset acha when: normal questions, edge cases (if 30th day p return), out of the scope questions, adverse quesitons to check system prompt


          expected input: we told this kiskaa kyaa

          evaluation: code (deterministic evaluation) llm as judge (quality evaluation) and humans

          deterministic: if correctness can be expressed clearly in code, use code
                         jse structured ka clear aegaa....isme llm ni chahiee bs json valid and schema validaiton mapping
                         agents me check bhi lgaaskte ho if func call hua yaa ni huaa....200 response diaa ya ni diaa etc etc
                         rag me top 3 tooo top k empty h to return krdo simple
          
         hence non deterministic baki me: server p aega ans llm se and second llm validate kregaaa usko cost bdh jaegi, token vgra....ek kaa kaam alg system prompt and then structured output return krnaa
                         judge llm check kregaaa ai quality metrics

                         relevancem correctness faithfulness helpfulness hallucinationo

                         relavance: kya llm ne response kia vo ans kia bhi ni kiaa query ko
                         correctness: even if relevant to correct h bhi yaa ni (source of truth: golden dataset, db, known fact)
                         faithfulness: rag k lie important...faithfulness ki query se extra knowledge di yaa ni
                         helpul: kya satisfactory h? ki simple word h yaa kseee
                         hallucinate: jo exist ni krti, jhuthi hoti h context hi lost yaa smjh alg jaegaa....context sirf miss ni but glt convey

                         1-5 hi rkhowww

            pointwise evaluation (ek brr mee ek hi prompt) and pairwise (testing llm prompt p1 and prompt p2 and then responses compareee ki konsa best tha)
            rubricss: 1-5 kaa mtlbb kyaa h faithfulness and every category ki mtlb 
            ek ek krkeee b krrskte hrr quality yaa ek sathh hi

            system prompt thoda kam hojata h but llm calls bdh jati h tradeoff

            or use humans (subjectivity ajatii h)

            offline evaluation means phlee...online when it is hosted by clientss 

*/