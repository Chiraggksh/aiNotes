
""" BASICS

python apna language h to convert into machine codes....python is interpreted language not compiled one
 
interpreted:
compiled: entire code into machine code all at once before program runs, generate a standalone executable file
interpreted:translate and execute on fly, line by line, through an interpretor 

done by python virtual machine (interpretor)

comments: # or """""" aisa krlowww
variables: kch bhi naam and = and value.....(no numbers at start, no spaces, no special char @ vgraa sbka apna usecase h python me _ lgalo but __ mt lgaanaa)
           naming convention: snakecase

variables me store kroge datatype ko: integers, float: decimal and fraction (p/q bhi float hogaa), complex v=34j ye hojaega complex
                                  strings: "" double or single quote
                                  boolean (True,False)
type(a) aisa check krrskte h

how strings work: string extra space leti h: unicode hota h hrr character ka

a=65 and then if i do chr(a) to unicode se character and character se unicode krna h to ord

indexing in strings: start with 0 positive, last se negative -1,-2,-3 etc
                     a[2] a[3] a[-1]
                     slicing bhi krrskte h: sher coder is sher nikaalna ho to a[0:4:1] start,stop,step hota h stop in not included 
                                            if value ni daali stop me to dafult daldo a[5::1] start tk slicing krdowww....a[::] hojaegaa puraa slice


type conversion: ek datatype se dusre me: 4 main func int(), float(), str(), bool().....normal logic str abc h to numerical na ho to int me kse kregaaa
                 a=12, if bool me kroge to true and 0 hota to false vahi truthy and falsy
                 False,0,0.0,"",[],(),{} jo empty aree like thiss

                 implicit vs explicit type conversion: abhi tk jo kiaa hmne vo tha explicit, implicit means python automatically krra h khudse

input and output: output is with print
                  variables enter krne ho to print("hi ",name,"and ....)
                  but u can do this by print(f"my name is {name} and my age is {age}")


                  input ke lie: input("Enter your age") ye terminal p kroge to input de paogee thats itt
                                its default datatype is string hence for int u do type conversion


                name=input("Enter your name")
                number=int(input("Enter the marks you got"))
                age=int(input("Enter your age as well"))


                print("Your name is",name,"and your age is", age)
                print(f"Your name is {name} and your age is {age}")  


operators: arithmetic: +,-,*,/,%,//,**
                       // is for floor division(if u want ki float ki jagah integer value aae sare decimal htjaegee so 6.4 ki jagah 6) and ** is for power
           python kitna bda bhi number leskta h
           bodmas krta h follow

           assignment: = assign values ezz
           compund assignment operator: a=10, a+=10, ese ese bdhti rhegi a me hi a=a+10 ki jagah a+=10 this is compound assignment

           comparison: <,>,<=,>=,==,!= returns in true or false
                       even bw float and integers and strings: ascii values p jesee "A">"B" gives false abc>acd gives false as b and c different
                       string and numbers mee ni hoskta compare...."a">34 etcc

           logical: and, or , not.....not me just comparison

conditional: 3 variations: if--elif--else (multiple elif statements)

loop: for and while
      for--> for i in range(start,stop,step)....range(stop imp)..range(21) rest will be default start=0,step=1
      while--> based on condition
        i=0
        while(i<10):
            print(i)
            i+=1

      for loop in strings: for i in range(0,9,1) or (9): print(a[i])
                           for i in a: print i
      
      break,continue,else statement...last vali else keyword lgtaa h loop k baharrr just to check if break chalaa yaa ni
      code:


        for i in range(11):
            if(i==10):
                print("yes break did")
                break

            print(i)

        else:
            print("break stmt didnt execute")

      
        ways to reverse: s.reverse() or s[::-1]
        palindrome: either do reverse and then check or normal while logic
        n=input("enter string")

        left=0
        right=len(n)-1

        while(left<=right):
            if(n[left]!=n[right]):
                print("Not a palindrome")
                break

            left+=1
            right-=1

        else:
            print("Yes it is palindrome") 

        check digit,num,special char --> i.isdigit(), .isalpha etc

        same cheez \n used to line end and start from new line
        
        random library se random: import random, random.randint(a,b) both inclusive

guessing game:
import random

predict=random.randint(1,10)

guess=int(input("Enter your guess"))
tries=0

while(guess!=predict):
    tries+=1
    if(guess>predict):
        print("your number is higher try smaller")
    else:
        print("your number is smaller")

    guess=int(input("Enter again"))
    
    
    

print(f"You took {tries} tries")


functions: def likho and then name
           3 arguments types: positional, keyword argument greet(name="",age=13 ) isse position not necessary, default argument def sum(a=35,b) something like that

data structures overview:

if u want to save multiple values, manipulate

4 inbuilt: list, tuples, dictionary, sets etc
baaki customised

LIST:
features: mutable, duplicates, heterogeneous (multiple data type), ordered (contiguous)

syntax= a=[10,20,30]
     u can do indexing and slicing same as string
     list traverse: same as string-- by len or by character

     for i in range(len(a)): print....

     list methods: class k andr jo defined hotaa h us funciton ko kehte h method
     to see print(dir(list)) all functions......for eg l.append(6), l.insert(idx,num)..eg(l.insert(1,2))
     to extend[] to extend list, remove me first occurence

TUPLES:
syntax= a=(1,2,3,4)

features: immutable, duplicates, ordered, heterogeneous
traverse same as list
same as string as string are immutable
methods: a.index(5).....5 number ka idx btadegaa
         a.count(5).....5 ki occurence
tuple unpacking: a,b,c,d=(1,2,3,4)....if a=(1) tb int if a=(1,) then it is tuple

SETS:
no duplicates, mutable, unordered (cant be accessed with index), heterogeneous (str,num,tuples etc but not everything as it needs only immutable hashable can go)
each value hashed using hash function
mutable objects like dic, list not allowed

syntax=s={1,2,3,4,5}

traversing: for i in a: print(i) even if 1,3,7,2 ho to print krega 1,2,3,7 whyyy
            system memory p depend kse hash value lera h 
methods: set mutable h but agar idx ni to kse kaam aega??:: s.add(), s.remove(), s.discard(), s.pop() remove random 

if u have 2 sets: to sets vala union, intersection etc

a.union(b) or a|b, a.intersection(b) or a&b, a.difference(b) or a-b, a.symmetric_difference(b)or a^b (compound operations can also be used)

DICTIONARY: other word hashmap
d={} empty b dict type, d={a:"b"}

mutable (not keys but values), duplicates (keys ni but values hoskti h),order with keys, heterogeneous nature any value of key and value
indexing not using 0,1, but with keys
crud operations on values and not on keys

d.update({5:500}) or d[50]=500
del d[30]

traversing: both keys and values

for i in d (iterate on keys-- i is the key)
for i in d.values() or d.keys()

methods: d.clear(), d.copy()--> shallow copy means reference jara h bss new ni bnraa .copy()
         d.get(20)
         
qs: merge 2 dict --> loop lgaake dkhlenaaa
    to check if key exists : if i in d2.keys()


exception handling:

bht errors hote h jse syntax, indentation, tab errors these cant be handled
but kch inke alvaa can be handled and are called exceptions

eg: number input lere ho jo divide krra h suppose bnde ne 0 dediaa to hoga error iski vjhse aage ki line ni chltiii h floww rukjara h

some keywords: try, except (like catch), else (if no exception occurs), finally, raise (manually throw error)

try:
  print(10/a)
except ZeroDivisionError: print....

normal code run hogaaa....but how to knw exceptions how many so do
except Exception as err: print(err)

else: when no exception occurs

finally: runs no matter what, exception hoe yaa naa hoeee
raise: manually throw exception --> raise ValueError("jegnkjeg")

FILE HANDLING:
crud operations in python.....p=open(r'main.py or koi bhi path ho')...r is a good practice
print(p.read())

open modes: 
r- read, file must exist
w- creates file or overwrites
a- adds to end of file
x- create a new file, fails if exists

r=open('path','w')-- creates or overwrite
and then r.write("aehbeahjbfejaefaejf")
r.close()

to not remove prev content: use mode a

from pathlib import Path
def readFile():
   path=Path('') //takes current folder
   items=list(path.rglob('*'))
   for i,items in enumerate(items):
      print(....enumerate used to take idx and values)

ye function jaega creating file mee...phle dikhaadoo and then take input p=Path(name) me daldo
            with open(p,'w) as fs:
                data=input("enter jo likhna h")
                fs.write(data)
            isse with k bhr jate hi close hojata h 

            p=Path(name)
            ye tb jb not p.exists() else print file exists and exceptions handling
            

            reading function meee same files dikhao and then show and p=Path(name) is p.exists() and p.is_file() then aageee with open(p,'r') as fs wala code with exception handling
            
            file name change: p1.rename(p2)
            os.remove(p)

FILE HANDLING PROJECT:
from pathlib import Path
import os 

def readfielandfolder():
    path = Path('')
    items = list(path.rglob('*'))
    for i, items in enumerate(items):
        print(f"{i+1}  : {items} ")


def createfile():
    try:
        readfielandfolder()
        name = input("please tell your file name :- ")
        p = Path(name)
        if not p.exists():
            with open(p,"w") as fs:
                data = input("what you want to write in this file :- ")
                fs.write(data)
            
            print(F"FILE CREATED SUCCESSFULLY")
        else:
            print("this file already exist")
        
    except Exception as err:
        print(f"An error occured as {err}")

def readfile():
    try:
        readfielandfolder()
        name = input("which file you want to read")
        p = Path(name)
        if p.exists() and p.is_file():
            with open(p,'r') as fs:
                data = fs.read()
                print(data)
            
            print("Readed successfully ")
        else:
            print("the file doesnot exist")
    except Exception as err:
        print(f"An error occured as {err}")


def updatefile():
    try:
            
        readfielandfolder()
        name = input("tell which file you want to update :- ")
        p = Path(name)
        if p.exists() and p.is_file():
            print("press 1 for changing the name of your file :- ")
            print("press 2 for overwriting the data of your file ")
            print("press 3 for appending some content in your file ")

            res = int(input("tell your response :- "))

            if res == 1:
                name2 = input("tell  your new file name :- ")
                p2 = Path(name2)
                p.rename(p2)
            
            if res == 2:
                with open(p, 'w') as fs:
                    data = input("tell what you want to write this is overwrite the data :- ")
                    fs.write(data)
        
            if res == 3:
                with open(p, 'a') as fs:
                    data = input("tell what you want to append :- ")
                    fs.write(" "+data)

    except Exception as err:
        print("an error occured as {err}")


def deletefile():
    try:

        readfielandfolder()
        name = input("whuich file you want to delete :- ")
        p = Path(name)

        if p.exists() and p.is_file():
            os.remove(name)
        
            print("file removes suiccessfully ")
    
        else:
            print("No such file exist")
    
    except Exception as err:
        print(f"An error occured as {err}")

    


print("press 1 for creating a file")
print("press 2 for reading a file")
print("press 3 for updating a file")
print("press 4 for deletion a file")

check = int(input("please tell your response :- "))

if check == 1:
    createfile()

if check == 2:
    readfile()

if check == 3:
    updatefile()

if check == 4:
    deletefile()

OOPS IN PYTHON:

imperative: phle variables alg alg lo , fir aai functional approach ki logic ek hi h, but then came oops approach
object bnaoo and then usee krowww

fyda: reusable, single, security, mgmt system

syntax--> class Bigname isme hote attributes and methods
          attribute normal variable and def hello():
          class bnaii to ek brr run hojtaa h

          Factory() initialise krna pdegaa then Factory().a or Factory().hello()
          def function me self as argument


objects in python: vahi obj=Factory() so now obj ab object bnchuka h all powers to him so obj.a, obj.hello()

constructor (what is self): iske through aap parameters accept kratee ho....that runs automatically when we run a class
                            def __init__(self,material,zips,requireents): self.material=material, self.zips=zips like that
                            
                            ab jb b Factory call kroge to yee bhjnaa hoga: self ek location ko target krta h ..ki konsi class ka instance h
                            multiple objects can have multiple detailling types

                            reebok and campus ke object bnae those link self and u can access them as well

                            def show(self) normal method in class -->> can access self.materials, self.pockets etccc
                            

attributes types: variables defined inside class, 
               1) class attribute: jo normal class me bnta h
               2) instance attribute: self.age=age is instance attribute when self se krteee hoooo

methods: 1) instance method: instance object of class jisme argument me self ae vo instance method hi hota h
         2) class method: work with class, not with instance --> used with decorator @classmethod and iske niche def hello(cls): cls points to class
         3) static method: it uses decorator, regular function inside classs @staticmethod def static(): print normal major used as helper and utility

class Student:
    def __init__(self, name, score):
        self.name = name          # Instance attribute
        self.score = score        # Instance attribute

    # Instance Method
    def edit_score(self, new_score):
        self.score = new_score    # Modifies instance data

s1 = Student("Alex", 85)
s1.edit_score(92)                 # Called on the object

classmethod example:

class Student:
    passing_score = 50            # Class attribute shared by all

    @classmethod
    def change_passing_score(cls, new_limit):
        cls.passing_score = new_limit  # Modifies class data

# Called directly on the Class
Student.change_passing_score(60) 


4 pillars off oops:

1) inheritance --> isme extends ni aata but rather isme aata h class ChildClass(parent): something like that
                   pass krdia class me..... 
                   constructor of parent class works for child class as well...parent valaa capacity ajata h child p to take values in object creation
                   super : def __init__(self,name,age) aisa krloww super().__init__(name) aisa krdoo coz name is from parent
                   and then self.age=age thats ittt
                   
                   types: single level (jo dkhaa upr), multiple(2 parents and child inherits both), child(parent1,parent2)....
                          suppose dono ka constructor h parnts kaa to robots kaa bnaoge to kkonse parameter sked (first argument kaa pucha jaegaa)--> first argument target this is called method resoluation order

                          multi level inheritance :: grandparent-> parent-> child 
                          hierarchial -> ek parent ke 2 child ya moree to vsee krrskte ho


2) polymorphism --> many forms -- a same name having diff forms....python overwrites
                    compile me 3 hote h but isme 2 kyuki yee method overloading ni hosktaa vo compile timee p check krra hota h
                    
                    only method overriding...child ka method chlegaaa definition if same name
                    one way is normal h...normal child me function bnao name se smjh ajaegaaa

                    duck typing: 
                    altho naam same h but kaam diff h and no inheritance but alg alg function h hrr ek specific function apnaa personal class ka function call kregaaa

3) encapsulation --> aap class and parent class sbke attributes dkh skte ho so its needed u need some privacy
                     access modifiers hote h isme default hote h public
                                             protected me hote h _a, in function (python me koi use ni h dusri lang me use krti h so this is naming convention taki dev ko pta chljae)
                                             private methods: __ double lgalowwww isko agar chahiee to usi class ke andrr hi showw krr sktee ho

4) abstraction --> not used more in python
                   abstract classes and methods --> to lay ki itne functions use honee chahieee...its subclasses must provide implementation

                   library import from abc import ABC, abstractmethod
                   class abstract(ABC):
                      decorator used...@abstractmethod and then define function and now if u doo inherit this in any child class to aapko isko define krna hi pdegaaa
                       
dunder methods: special methods start and end with __.... automatically perfomr when u perform action on object 
                jseee __init__, __str__(self) aisa krkee bhaii apnaa return krade fir jb obj ko print krega to ye dega vrna phlee location dera tha
                and pura object ke values leeskte ho appp

                addition leskte ho def __add__(self,other): return self.age+other.age and then print(obj1+obj2)
                agar 3 cheeze add krni ho to ap other me other1, other2 ni krrskte iske lie chahiee args and kargs advanced concepts
                either do in tuple... print(obj+(obj2,obj3)) and define me other me tuple ara h.....

                for i in other: sum+=i.age and then self.age+sum aisaa krrskte ho
                more such dunder: add,rep,equlity etcc vgra vgraa work bw 2 objects


advanced methods:

1) decorator: bht hote h jse @property ...function bina call kiee bhi change krlenaa
              decorator is a func that modified other function without changing code....
              wrapper chahiee...decorator lgaaskte h jse print funciton meee

              @decorate 
              and then def decorate(func): def wrapper(): print first line, func(), second line print,
              and then return wrapper
              and then it will help u in thiss jo func hbjre ho to vo wrapper bhi accept krega....
              decorator jis func p lga h usko capture krta h, wrapper is used to capture arguments

              if u dont know kitne values jaree h to brr br wrapper thodi change krogee hence argument me likhdo *args

              args and kargs
              * and **
              if normal add ho to def sum(a,b) but what if arguments bhottt hore hoo kitnee krogeee....inputs kitne hogeee
              def addition(*args) --> issse sb kch tuplee bnjaegaaa 

              then what is kwargs.**
              this is keyword argument if name ke basis p argument dkhnaa ho....so it stores in dictionary
              function me dono bhjskte ho args and kwargs and wrapper ko hi change krdoo kyuki eventually udhr hi kaam horaa h andd apne jispe decorator lgare ho usko chedne ki zrurt ni h coz vse b vo call list ki trhh hogaaa


              set comprehension:
              ternary operation...print("even") if a%2==0 else print("odd")
              
              so what is this comprehension:
              multiple lines me ni.....

              eg if i to 20 even list me daalnee ek to loop lgaaaoge, but single line sebhiii
              l=[i for i in range[1,21] if i%2==0]
              phleee vo jisko add krna hooo.....

              dict me thoda alg: 
              l={i:i**2 for i in range(1,10)} tahts it

              set is also very ezzzz


              lambda functions:
              anonymous func,one line, once temporary one expression

              suppose add function h to u can do add=lambda a,b:a+b and then do print(add)

              map and filter me use hota h lambda functions.....
              map vala hrr ek element p function hota h....rjse a ek list h too result=map(lambda x: x*2,a) map function expcts function and iterable but it changes it to object so isko list
              me convert krlenaaaa

              filter: used to filter out stuff, same map ki trh syntax

              modules and packages: numpy,pandas etc....single file containing code and then u import them...
              eg maths.py me function bnaliee saree.....so u do import maths this is modules and they aredivided into packages and then maths.addition
              or u do from maths import add
              package is a folder containing one or more modules aand then u import it
              if folder ke adrr folder ho to from folder1.folder2 import maths etc vgra vgraaaa
"""  





