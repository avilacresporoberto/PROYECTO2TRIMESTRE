
/* Con esta consulta lo que pretendo es, despues de usar el lookup para enlazar las dos colecciones, hago un project para que me de 
informacion del empleado y luego sus departamentos y cada sueldo*/

db.empleados2.aggregate(
    [
        {
            $lookup: {
                from: "departamentos2",
                localField: "Cargo",
                foreignField: "Departamento",
                as: "departamentos"
            }
        },
        {
            $project: {
                _id: 1,
                Nombre: 1,
                Apellidos: 1,
                Coche_empresa: 1,
                departamentos: {
                    Departamento: 1,
                    PrecioHora: 1,
                },
            }
        },
        {
            $sort: { Nombre: 1 }
        }

    ]
).pretty()



/* Quiero tener ordenados por cada departamento, saber cual es su jornada diaria, cuantos dias trabaja a la semana y el total de 
horas que trabaja al mes, todo esto con una condicion, que el trabajador tengo una jornada superior a las 4 horas, es decir 
no tenga contrato de media jornada*/


db.departamentos2.aggregate([
   {
        $project:{
          _id:0,
          Departamento: "$Departamento",
          Jornada: "$Jornada",
          DiasTrabajados: "$DiasTrabajados",
          TotalHorasalMes:{$multiply:["$Jornada", "$DiasTrabajados"]},
    } 
    },
    {
         $match: { $expr: { $gte: [ "$Jornada" , 5 ] }},

    },
    {
        $sort: { TotalHorasalMes: 1 }
    }
]).pretty()



/* En esta consulta quiero saber de los trabajadores que son camioneros, cuantos años llevan contratados en la empresa y los quiero 
ordenar desde el que lleva más años contratado primero hasta el último que será el que se haya incorporado a la empresa más tarde 
en el cargo de camionero.*/

 db.empleados2.aggregate(
    [ { $match: {"Cargo":{$eq:"Camionero"}}},
        {
        $project:
          { _id:"$Nombre",
            "añostrabajados": {"$divide":[
                { $subtract:
                 [ new Date(), "$Fecha_contratacion" ]  }, 1000 * 60 * 60 * 24 * 365]},
        }
      },
      { $sort : { añostrabajados : -1 } }
    ]
 ).pretty()



//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

 /**/ 
 db.empleados2.aggregate(
    [
        {
            $lookup: {
                from: "departamentos2",
                localField: "Cargo",
                foreignField: "Departamento",
                as: "departamentos"
            }
        },
        {
            $project: {
                _id: 1,
                Nombre: 1,
                Apellidos: 1,
                Coche_empresa: 1,
                departamentos: {
                    Departamento: 1,
                    PrecioHora: 1,
                },
            }
        },
        {
            Sueldo:{ $multiply: ["$departamentos.Jornada","$departamentos.PrecioHora"]},
        }

    ]).pretty()
/* */
db.departamentos2.aggregate([
    {
         $project:{
           _id:0,
           Departamento: "$Departamento",
           Jornada: "$Jornada",
           DiasTrabajados: "$DiasTrabajados",
           SueldoDia:{$multiply:["$Jornada", "$PrecioHora"]},
           SueldoMes:{$multiply:["$SueldoDia", "$DiasTrabajados"]},
     } 
     },
     {
         $sort: { SueldoDia: 1 }
     }
 ]).pretty()