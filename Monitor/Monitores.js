1)

a)SI, el codigo funciona correctamente.

b)

Process Auto [I:1..M]{
	Puente. cruzar(i);
}


Monitor Puente
Begin

	Procedure cruzar (au: integer){
		“el auto cruza el puente”
	}

end.

c)La solucion original no respeta el orden de llegada ya que con el modo Signal and wait 
los procesos que se despiertan del Wait(variable_condicion) mediante el comando siganl(variable_condicion)
pasan a competir por entrar nuevamente al Monitor, sin embargo la nueva reescritura del codigo
si respeta el orden de llegada.

2)

3)
process persona[i: 1..n]{
    string estado;

    Banco.llego(i);
    Timer[i].iniciar();
    Estado[i].dormir();

    Estado[i].getEstado(estado);
    if (estado != 'portimer'){
        //hacer lo que tenga que hacer
    }
}

process timer[i: 1..n]{
    Timer[i].iniciar2();
    sleep(15); //15 minutos
    Estado[i].setEstadoPorTimer(); 
}

process empleado[i: 1..2]{
    int idPersona, string estado;
    while(true){
        Banco.damePersona(idPersona);
        Estado[idPersona].setEstadoEmpleado(estado);
        if (estado == 'porempleado'){
            //loatiende
        }
    }
}

monitor Banco {
    
    queue personas;
    cond esperar;

    procedure llego(i){
        personas.push(i);
        signal(esperar); // Despierta al empleado en caso de que el empleado haya llegado primero por damePersona
    }

    procedure damePersona(out idPersona){
        if (personas.empty()){
            wait(esperar);
        }
        idPersona = personas.pop();
    }
}

monitor Timer[i:1..n] {
    boolean empezar = false;
    cond esperar;
    procedure iniciar(){
        empezar = true;
        signal(esperar);
    }

    procedure iniciar2(){
        if (!(empezar)){
            wait(esperar);
        }
    }
}

monitor Estado[i: 1..n]{
    
    cond esperar;
    string estado = 'normal';

    procedure dormir(){
        wait(esperar);
    }

    procedure getEstado(out outEstado){
        outEstado = estado;
    }

    procedure setEstadoPorTimer(){
        if (estado == 'normal'){
            estado = 'portimer';
        }     
    }

    procedure setEstadoEmpleado(out outEstado){
        if (estado == 'normal'){
            estado = 'porempleado';
        }
        outEstado = estado;
    }
}

5)
rocess abuela(){
    while(true){
        x=this.nroDeCaramelos();
        Fuente.deposita(x);  
    }
}

process nieto[i: 1..n]{
    while(true){
        Fuente.tomar();
    }
}

Monitor Fuente{
    
    int cantCaramelos;
    cond abuelaDuerme;
    cond muchachos;
    cond primero;
    boolean primeroPaso = false; // pregunta si soy el primero sin comer, porq tendre prioridad a la hora de despertar para comer
    

    procedure deposita(cant){
        cantCaramelos = cant;
        primeroPaso = false;
        signal(primero);
        wait(abuelaDuerme);
    }

    procedure tomar(){
        if (cantCaramelos > 0){
            cantCaramelos--;
        }else{
            if (primeroPaso){
                wait(muchachos);
            }else{
                primeroPaso = true;
                signal(abuelaDuerme);
                wait(primero);
                cantCaramelos--;
                signal_all(muchachos);
            }
        }
    }
}

6)

process Alumno[i:1..50]{
    
    int grupo;
    int orden;
    
    Comision.llegue();
    Jtp.darNroGrupo(grupo);
    Comision.buscarCompañero(grupo);
    this.realizarTarea();
    Jtp.darOrden(orden, grupo); //Avisa termino de realizacion de Trabajo y recibe el orden de Finalizacion
}

Monitor Jtp {

    int order = 0;
    cond[] alumnos[1..25]; 
    int[] cantGrupo[1..25]=0;

    Procedure darNroGrupo(OUT int nro){
        nro = darNro();
    }
    

    Procedure darOrden(OUT int orden,IN int grupo){

        int nroGrupo = grupo;
        if (cantGrupo[nroGrupo] == 1) {
            signal(alumnos[nroGrupo]);
            
        }else{
            orden ++;
            cantGrupo[nroGrupo]++;
            wait(alumnos[nroGrupo]);
        }
        orden;
        
    }
}


Monitor Comision {

    int cant = O;
    cond alumno;
    cond[] esperarCompañero[1..25];
    int[] cantGrupo[1..25]=0;

    Procedure llegue(){
        cant++;
        if (cant == 50){
            signalAll(alumno);
        }
        else{
            wait(alumno);
        }
    }

    Procedure buscarCompañero(IN int grupo){
       int nroGrupo= grupo;
       if (cantGrupo[nroGrupo] == 1 ) {
            signal(esperarCompañero[nroGrupo]);
        } 
        else{
            cantGrupo[nroGrupo]++;
            wait(esperarCompañero[nroGrupo]);

        }    
    }
}
