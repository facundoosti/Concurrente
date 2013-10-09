1)a)

/*Variables*/

sem esperar = 1;

/*Algoritmo*/
Process Persona [i=1..N]{
	P(esperar)
	"Pasadon x el detector"
	V(esperar)
} 

b)

/*Variables*/

sem esperar = 3;

/*Algoritmo*/
Process Persona [i=1..N]{
	P(esperar)
	"Pasadon x el detector"
	V(esperar)
} 

2) No es la mejor solucion, ya que por ejemplo en el caso de que 5 procesos con 
prioridad alta tengan acceso al semaforo lo obtendra y restringira el acceso a 
aquellos procesos de prioridad baja que deseen hacer uso de él.

3)

/*Variables*/

sem acceso_buffer = 1;
sem esperar = 0;
sem despertar = 0;
sem mutex_cant = 1;
int cant;
object buffer;

/*Algoritmo*/

Process Productor{
	loop{
		buffer = crear_elemeto();
		P(mutex_cant)
		cant = 0;
		V(mutex_cant)
		for i=1 to C do{
			V(despertar)
		}
		P(esperar)
	}
} 

Process Consumidor [i=1..C]{
	P(despertar)
	P(acceso_buffer);
	consumir(buffer);
	V(acceso_buffer);
	P(mutex_cant);
	cant++;
	if cant = C{
		V(mutex_cant);
		V(esperar)
	else
		V(mutex_cant);
	}	
	P(despertar)
} 

4)
/*Variables*/

sem mutex_cant = 1;
sem esperando = 1;
sem cola = 1;
sem profe_esperando = 0;
sem[] esperando[1..50] = 0;
[] nota_alumno[1..50] = 0;
int cant;

/*Algoritmo*/

Process Alumno[i:1..50]{
	int job=elegir();
	P(mutex_cant); //barrera
	cant++;
	if (cant = 50 ) {
		V(mutex_cant);
		for j:1 to 49 do{
			V(esperando);
		}
	else
		V(mutex_cant);
		P(esperando);
	}
	realizar_tarea();
	P(cola);
	c.push(i, job);
	V(cola);
	V(profe_esperando);
	P(esperando[i]);
}

Process Profesor{	
	int nota = 10;
	queue[] tareas_terminadas[1..10];
	loop{
		P(profe_esperando);
		P(cola);
		int alu, tarea = c.pop(i, job);
		V(cola);
		tareas_terminadas[tarea].push(alu);
		if tareas_terminadas[tarea].size() == 5{
			for each tareas_terminadas[tarea] do { //Para cada elemento de la cola
				int alumno=tareas_terminadas[tarea].pop()
				nota_alumno[alumno] = nota;
				V(esperando[alumno]);
			}
			nota--;
		}
	}
}




5)
/*Variables*/

cola c:=new cola();
boolean estado[1..n]:=false;
boolean resolucion[1..n]:=false;
int cantAlu:=0;
sem colaLlena:=1;
sem llegaAlumno:=0;
sem scantAlu:=1;
sem esperaCorrecion[1..n]:=1;
sem sEstado[1..n]:=1;
sem sReloj[1,,n]:=1;

/*Algoritmo*/

Process Alumno[i:=1..n]{
	P(colaLlena);
	c.push(i);
	V(colaLlena);
	v(sReloj[i]);
	V(llegaAlumno);
	P(esperaCorreccion[i]);
	P(sEstado[i]);		
	if(not estado[i]){ 
		V(sEstado[i]);
		while(not resolucion[i]){
			P(colaLlena);
			c.push(i);
			V(colaLlena);
			V(llegaAlumno);
			P(esperaCorreccion[i]);
		}
	}		
	P(scantAlu);	
	cantAlu++;
	V(scantAlu);
}

Process Ayudante[j:=1..a]{
	P(llegaAlumno);
	P(scantAlu);	
		While(cantAlu<N){
			V(scantAlu)		
			P(colaLlena);
			if(not c.empty()){
				int alu:=c.pop();
				V(colaLlena);
				ayudante ayu:=new Ayudante();		
				resolucion[alu]:=ayu.corregir();
				V(esperaCorreccion[alu]);
			}	
			else{	
				V(colaLena);
			}
			P(llegaAlumno);
			P(scantAlu);	
		}
}

Process Reloj[r:=1..n]{
	P(sReloj[r]);
	dislay(15*60);
	P(sEstado[r]);		
	estado[r]:=true;
	V(sEstado[r]);	
}

7)
/*Variables*/

es_primero = true;
sem mutex = 1;
sem cola  = 1;
sem[] estado[1..n] = 1;
sem[] esperando[1..n] = 1;
sem[] reloj_comenzar[1..n] = 1;

/*Algoritmo*/

Process Camion[i:=1..n]{
	V(reloj_comenzar[i]);
	P(mutex);
	if not es_primero{
		V(mutex);
		P(cola);
		c.push(i);
		V(cola);
		P(esperando[i]);
	else
		V(mutex);	
	}
	P(estado[i]);
	if not estado[i]{ //Si el reloj no termino
		V(estado[i]);
		"Descargar cereales";
	}
	sig = c.pop();
	V(esperando[sig]);
}

Process Reloj[r:=1..n]{
	P(reloj_comenzar[r]);
	dislay(2hrs);
	P(estado[r])
	estado[r] = true;
	V(estado[r]);
}

8) No resuelve lo pedido porque ninguno de los alumnos despierta a los profesores, 
los profesores se quedan atascados en P(llegoA)|P(llegoB).
