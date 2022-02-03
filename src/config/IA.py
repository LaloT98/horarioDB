import sys
from random import getrandbits,randint,random,choice
from unittest import result
from pymongo import MongoClient
from matplotlib import pyplot as plt


#----------------------         VARIABLES           ----------------------#
Total_materias = []
Original_Total_materias = []
DiasPorSemana   = 5 #dias******5*****
HorasDia        = 6 #horas*****6*****
horaDeInicio    = 8 #Inicia a las 8 de la manana las clases
horaDeFin     = (horaDeInicio + HorasDia)
sumaHoras = 0
historico= []
valores2 = []
Semana = []
error = False

n_cromosomas = DiasPorSemana * 20
generaciones = 40
ciclos = generaciones
peso_maximo = HorasDia

#---------------------- EXTRAER LOS DATOS DE MONGODB----------------------#
MONGO_URI = "mongodb://localhost"
client = MongoClient(MONGO_URI)
db = client['horarios-app']
collectionMaterias = db["escuela2"]
collectionHorarios = db["horarios"]
Materias = collectionMaterias.find()

for y in Materias:
    Total_materias.append(y["array"])
    Original_Total_materias.append(y["array"])
# print(Original_Total_materias)

for xc in enumerate(Original_Total_materias):
    print(xc)
n_items = len(Total_materias)


def suma():
    for i in range(len(Total_materias)):
        historico.append((Total_materias[i][2]))
        if i == (len(Total_materias)-1):
            return historico
sumaHoras = sum(suma())

####################### ALGUNAS RESTRICCIONES ###################
if sumaHoras >= (DiasPorSemana * HorasDia): 
    print("Dias a la semana:        ",DiasPorSemana)
    print("horas al dia:            ", HorasDia)
    print("Horas de las materias:  ",sumaHoras)
    print("horas disponibles:      ", DiasPorSemana * HorasDia)
    next
else: 
    print("ERROR: Las horas disponibles deben ser iguales al total de las horas de las materias")
    print("Horas de materias:",sumaHoras)
    print("horas disponibles:", DiasPorSemana * HorasDia)
    error = True

if n_items <= ((DiasPorSemana * HorasDia)/2): next
else: error = True

for indice, valor in enumerate(Total_materias):
  valores2.append(valor[1])
min_valor = min(valores2)

#-------------------------------------------- CREACION DEL INDIVIDUO--------------------------------------------#
def individuo(n_items):#
    return [ getrandbits(1) for x in range(n_items)]

#-------------------------------------------- CREACION DE LA POBLACION----------------------#
def poblacion(n_de_individuos, n_items):
    return [ individuo(n_items) for x in range(n_de_individuos) ]

#-------------------------------------------- CREACION DEL FITNESS----------------------#
def fitness(individuo, peso_maximo, Total_materias):
    materias_total, horas_total = 0, 0
    for indice, valor in enumerate(individuo):
        materias_total += (individuo[indice] * Total_materias[indice][5])
        horas_total += (individuo[indice] * Total_materias[indice][1])
        if (peso_maximo - horas_total) < 0:
            return -1
    return horas_total

#-------------------------------------------- Encuentre la calificacion promedio de la poblacion----------------------#

def media_fitness(poblado, peso_maximo, Total_materias):
    resubir = sum(fitness(x, peso_maximo, Total_materias) for x in poblado 
                  if fitness(x, peso_maximo, Total_materias) >= 0
                  )
    return resubir / (len(poblado) * 1.0)

#--------------------------------------------SELECCION DEL INDIVIDUOS----------------------#
def seleccion_ruleta(pais):
    def sortear(fitness_total, indice_a_ignorar=-1):
        ruleta, acumulado, valor_sorteado = [], 0, random()
        if indice_a_ignorar!=-1:
            fitness_total -= valores[0][indice_a_ignorar]
            # print("fitness_total",fitness_total,  valores[0][indice_a_ignorar])
        for indice, i in enumerate(valores[0]):
            if indice_a_ignorar==indice:
                continue
            acumulado += i
            ruleta.append(acumulado/fitness_total)
            
            # print("ruleta",ruleta, )
            if ruleta[-1] >= valor_sorteado:
                return indice
        # print("ooo=", (valores[0]))
        print("acumulado",acumulado,"fitness_total" , fitness_total)
    valores = list(zip(*pais))
    fitness_total = sum(valores[0])
    indice_padre = sortear(fitness_total) 
    indice_madre = sortear(fitness_total, indice_padre)
    padre = valores[1][indice_padre]
    madre = valores[1][indice_madre]
    return padre, madre

#-------------------------------------------- EVOLUCION DE LOS INDIVIDUOS----------------------#
def evolucion(poblado, peso_maximo, Total_materias, n_cromosomas, mutacion=0.05): 
    pais = [ [fitness(x, peso_maximo, Total_materias), x] for x in poblado 
            if fitness(x, peso_maximo, Total_materias) >= 0]
    pais.sort(reverse=True)
    # REPRODUCCION
    hijos = []
    while len(hijos) < n_cromosomas:
        hombre, mujer = seleccion_ruleta(pais)
        mitad = len(hombre) // 2
        hijo = hombre[:mitad] + mujer[mitad:]
        hijos.append(hijo)
    # MUTACION
    for individuo in hijos:
        if mutacion > random():
            posicion_a_mutar = randint(0, len(individuo)-1)
            if individuo[posicion_a_mutar] == 1:
                individuo[posicion_a_mutar] = 0
            else:
                individuo[posicion_a_mutar] = 1
    return hijos
historico_de_fitness = []
#-------------------------------------------- EJECUCION DEL ALGORITMO GENETICO----------------------#
def ejecucion(poblado):
    global historico_de_fitness
    historico_de_fitness = [media_fitness(poblado, peso_maximo, Total_materias)]
    for SelDia in range(generaciones):
        poblado = evolucion(poblado, peso_maximo, Total_materias, n_cromosomas, mutacion=0.05)
        historico_de_fitness.append(media_fitness(poblado, peso_maximo, Total_materias))
    for SelDia in range(len(poblado)):
        sumadia = sum(poblado[SelDia])
        divi = int(HorasDia/min_valor)
        #print("sumadia",sumadia,"   divi", divi)
    if sumadia == divi:
        diaSemana = (poblado[SelDia])
        return diaSemana

#-------------------------------------------- EVALUAR EL DIA DADO POR EL AG----------------------#
poblado = poblacion(n_cromosomas, n_items)
def fitnessDia():
    global ciclos
    dia = ejecucion(poblado)
    while(dia == None and ciclos > 0):
        dia = ejecucion(poblado)
        ciclos = ciclos -1
        dia = dia
        ciclos = ciclos
    

    for indice, valor in enumerate(dia):
        # anterior = Total_materias[indice][3]
        varrr = (dia[indice] * Total_materias[indice][1])
        Total_materias[indice][3] = varrr + Total_materias[indice][3]
        # print("I:", indice, Total_materias[indice][1],Total_materias[indice][2],"(",anterior,"<=",varrr,")", Total_materias[indice][3])
        if Total_materias[indice][3] >= Total_materias[indice][2]:
            Total_materias[indice][3] =  100
            Total_materias[indice][1] =  100
        else:
            Total_materias[indice][3] =Total_materias[indice][3]
            Total_materias[indice][1] =Total_materias[indice][1]
    return dia


#PRINT FINAL

if error == False:
    print("\n\nMaterias disponibles:")
    for indice, i in enumerate(Total_materias):
        print("Item ",indice+1,": ID",i[0]," | ",i[1],"MinHoras", " | ", i[2], "MaxHoras")
    for item in range(DiasPorSemana): #DiasPorSemana
        Semana.append(fitnessDia())
        sumatoria = sum(Semana[item])*2
        print("\ndia", item+1, Semana[item], " ==", sumatoria, "horas al dia")
    dato = {"horario": Semana, "usuario": "administrador"}
    #collectionHorarios.insert_one(dato) #subir los dato
    '''
    plt.plot(range(len(historico_de_fitness)), historico_de_fitness)
    plt.grid(True, zorder=0)
    plt.title("Horario")
    plt.xlabel("Generacion")
    plt.ylabel("Valor medio del dia")
    plt.show()
    '''
  
else:
    print()
    print("Una restriccion no se cumplio")
    print("Lea el error por favor")
sys.stdout.flush()