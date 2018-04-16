db.system.js.save({
	_id: "cUsuario",
	value: function (idUsuario,nick,det) 
	{ 
		try{
			db.Usuarios.insertOne({
			_id:idUsuario, 
			nickname:nick, 
			detalles:det,
			partidas:[],
			friends:[],
			chats:{}});
			return true;
		}
		catch(e){
			return false;
		}
	}
});  

db.system.js.save({
	_id: "uDetalles",
	value: function (idUsuario,det) 
	{ 
		try{
			db.Usuarios.updateOne(
		   { _id: idUsuario },
		   {
		     $set: { detalles: det }
		   }
		);
			return true;
		}
		catch(e){

			return false;
		}
	}
});  

db.system.js.save({
	_id: "uNickname",
	value: function (idUsuario,nick) 
	{ 
		try{
			db.Usuarios.updateOne(
		   { _id: idUsuario },
		   {
		     $set: { nickname: nick }
		   }
		);
			return true;
		}
		catch(e){

			return false;
		}
	}
});  

db.system.js.save({
	_id: "linkUsuarioPartida",
	value: function (idUsuario,idPartida,color) 
	{ 
		try{
			if (db.Partidas.find({_id:idPartida}).toArray()[0].usuarios[0][0] == idUsuario || db.Partidas.find({_id:idPartida}).toArray()[0].usuarios[0][0] == idUsuario)
				return false;
			ok = false;
			if (db.Partidas.find({_id:idPartida}).toArray()[0].usuarios[0][0] ==0 && db.Partidas.find({_id:idPartida}).toArray()[0].usuarios[1][1]!=color){
				db.Partidas.update({_id:1},{$set : {'usuarios.0.0' : idUsuario}});
				db.Partidas.update({_id:1},{$set : {'usuarios.0.1' : color}});
				ok=true;
			}
			else if (db.Partidas.find({_id:idPartida}).toArray()[0].usuarios[1][0] == 0  && db.Partidas.find({_id:idPartida}).toArray()[0].usuarios[0][1]!=color){
				db.Partidas.update({_id:1},{$set : {'usuarios.1.0' : idUsuario}});
				db.Partidas.update({_id:1},{$set : {'usuarios.1.1' : color}});
				ok=true;
			}
			if (ok){
			db.Usuarios.update(
			   { _id: idUsuario },
			   { $push: { partidas: idPartida } });
				return true;
			}
		else
			return false;
		}
		catch(e){

			return false;
		}
	}
}); 

db.system.js.save({
	_id: "chat", 
	value : function (idEmisor,idReceptor,msg) 
	{ 
            if (db.Usuarios.find({_id:idEmisor}).toArray()[0]!=null && db.Usuarios.find({_id:idReceptor}).toArray()[0]!=null){
        		idReceptor='chats.'+idReceptor;
				db.Usuarios.update(
		   			{ _id: idEmisor },
		   			{ $push: { [idReceptor]:  [Date(),msg]} });
				return true;
			}
            else{
            	return false
            }
        }
    });

db.system.js.save({
	_id: "getChatLog", 
	value : function (idOne,idTwo) 
	{ 
                var R1=db.Usuarios.find({_id:idOne},{['chats.'+idTwo]:1,_id:0}).toArray()[0].chats[idTwo];
                var R2=db.Usuarios.find({_id:idTwo},{['chats.'+idOne]:1,_id:0}).toArray()[0].chats[idOne];
                lista=[];
                while(R1.length>0 || R2.length>0){
	                if(R1.length>0 && R2.length>0){
	                    fechaOne = Date.parse(R1[0][0]);
	                    fechaTwo = Date.parse(R2[0][0]);
	                    if(fechaOne<fechaTwo)
	                        lista.unshift([0,R1.shift()[1]]);
	                    else
	                        lista.unshift([1,R2.shift()[1]]);
	                }
	                else if(R1.length>0){
	                    while(R1.length>0)
	                        lista.unshift([0,R1.shift()[1]]);
	                }
	                else{
	                    while(R2.length>0)
	                        lista.unshift([1,R2.shift()[1]]);
	                }
            }
                return lista.reverse();
		}
    });

db.system.js.save({
	_id: "nuevaSesion",
	value: function (idJ1,color1,idJ2,color2,size,lineSize,nRondas) 
	{ 
		try{
			if ((db.Usuarios.find({_id:idJ1}).toArray()[0]==null && (idJ1!="e" && idJ1!="m" &&idJ1!="h")) || (db.Usuarios.find({_id:idJ2}).toArray()[0]==null && (idJ2!="e" && idJ2!="m" &&idJ2!="h")) || color1==color2)
				return false;
			fila='[-1';
			for(x=1;x<size;x++){
				fila=fila+',-1';
			}
			fila=fila+']';
			tablero='['+fila;
			for(x=1;x<size;x++){
				tablero=tablero+','+fila;
			}
			tablero=tablero+']';
			ronda='{"estado":{"finalizador":"","causa":""},"tablero":'+tablero+',"jugadas":[]}';
			rondas='['+ronda;
			for(x=1;x<nRondas;x++){
				rondas=rondas+','+ronda;
			}
			rondas=rondas+']';
                        query='{"_id":'+(db.Partidas.find().count()+1)+', "estado":true, "tamano":'+size+',"tamano_linea":'+lineSize+',"usuarios":[["'+idJ1+'","'+color1+'"],["'+idJ2+'","'+color2+'"]],"rondas":'+rondas+',"nRondas":'+nRondas+'}';
                        db.Partidas.insertOne(JSON.parse([query]));
                        db.Usuarios.update(
   			{_id: idJ1},
   			{ $push: { partidas: db.Partidas.find().count() } });
                        db.Usuarios.update(
   			{_id: idJ2},
   			{ $push: { partidas: db.Partidas.find().count() } });
            return db.Partidas.find().count();
		}
		catch(err){
			return false;
		}
	}
}); 

db.system.js.save({
	_id: "jugada",
	value: function (idPartida,ronda,fila,columna,jugador) 
	{ 
        try{
            path="rondas."+[ronda]+".jugadas";
			db.Partidas.update(
			   { _id: idPartida },
			   { $push: {[path] : [fila,columna] } });
			db.Partidas.update({_id:idPartida},{$set : {['rondas.'+ronda+'.tablero.'+fila+'.'+columna]:jugador}});
			db.Partidas.update({_id: idPartida}, {$set:{lastMove: Date()}})
			return true;
		}
		catch(e){
			return false;
		}
	}
}); 

db.system.js.save({
	_id: "getInfoPartida",
	value: function (idPartida) 
	{ 
        return db.Partidas.find({_id:idPartida},{_id:1,estado:1,tamano:1,tamano_linea:1,usuarios:1,lastMove:1,nRondas:1}).toArray()[0];
		}
});  

db.system.js.save({
	_id: "getInfoRonda",
	value: function (idPartida,ronda) 
	{ 
        return db.Partidas.find({_id:idPartida}).toArray()[0].rondas[ronda];
		}
}); 

db.system.js.save({
	_id: "getTablero",
	value: function (idPartida,ronda) 
	{ 
        return db.Partidas.find({_id:idPartida}).toArray()[0].rondas[ronda].tablero;
		}
}); 

db.system.js.save({
	_id: "setTablero",
	value: function (idPartida,ronda,tablero) 
	{ 
            try{
                db.Partidas.update({_id:idPartida},{$set : {['rondas.'+ronda+'.tablero']:tablero}});
                return true
            }
            catch(e){
                return false
            }
		}
}); 

db.system.js.save({
	_id: "getGameLog",
	value: function (idPartida,ronda) 
	{ 
        return db.Partidas.find({_id:idPartida}).toArray()[0].rondas[ronda].jugadas;
		}
}); 

db.system.js.save({
	_id: "finalizarRonda",
	value: function (idPartida,ronda,idFinalizador,razon) 
	{ 
		try{
		path="rondas."+[ronda];
        db.Partidas.update(
        	{_id:idPartida},
        	{$set:{['rondas.'+ronda+'.estado.causa']:razon,['rondas.'+ronda+'.estado.finalizador']:idFinalizador}});
        	return true
		}
		catch(e){
			return false;
		}
		}
}); 

db.system.js.save({
	_id: "finalizarPartida",
	value: function (idPartida) 
	{ 
		try{
        db.Partidas.update(
        	{_id:idPartida},
        	{$set:{'estado':false}});
        	return true;
		}
		catch(e){
			return false;
		}
		}
}); 
db.system.js.save({
	_id: "getInfoRonda",
	value: function (idPartida,ronda) 
	{ 
		path="rondas."+[ronda];
        return db.Partidas.find({_id:idPartida}).toArray()[0].rondas[ronda];
		}
}); 
db.system.js.save({
	_id: "checkUsuario",
	value: function (idUsuario) 
	{ 
		if (idUsuario=="e")
			return({"nickname":"Easy Robot","detalles":"Robot facil"})
		else if (idUsuario=="m")
			return({"nickname":"Medium Robot","detalles":"Robot medio"})
		else if (idUsuario=="h")
			return({"nickname":"Hard Robot","detalles":"Robot dificil"})
        return db.Usuarios.find({_id:idUsuario},{nickname:1,detalles:1,_id:0}).toArray()[0];
		}
}); 

db.system.js.save({
	_id: "gameListFilter",
	value: function (idUsuario,activo) 
	{ 
		let result = db.Usuarios.find({_id:idUsuario},{partidas:1}).toArray()[0];
		let retorno = [];
		if (result!=null){
			let listaPartidas = result.partidas;
			listaPartidas.forEach(function(x){
				if(db.Partidas.find({_id:x,estado:activo}).toArray()[0]!=null)
					retorno.push(x);
			});
		}
        return retorno;
		}
}); 

db.system.js.save({
	_id: "rondaActiva",
	value: function (idPartida) 
	{ 
		let result = db.Partidas.find({_id:idPartida},{rondas:1,nRondas:1}).toArray()[0];
		if (result!=null){
			let listaRondas = result.rondas;
			for (let x = 0; x < result.nRondas;x++){
				if(listaRondas[x].estado.finalizador=="")
					return x;
			}
		}
        return -1;
		}
}); 

db.system.js.save({
	_id: "friend",
	value: function (id1,id2) 
	{ 
		if (db.Usuarios.findOne({_id:id2})==null || id1==id2)
			return false;
		let friendList = db.Usuarios.find({_id:id1}).toArray()[0].friends;
		if (friendList==null)
			return false;
		friendList.forEach(x =>{
			if (x==id2)
				return false;
		})
		db.Usuarios.update(
   			{_id: id1},
   			{ $push: { friends: id2 } });
		return true;
}})


db.system.js.save({
	_id: "friendList",
	value: function (id1) 
	{ 
		if (db.Usuarios.findOne({_id:id1})==null)
			return false;
		let friendList = db.Usuarios.find({_id:id1}).toArray()[0].friends;
		if (friendList==null)
			return false;
		let richList = [];
		friendList.forEach(x =>{
			richList.push([x,db.Usuarios.find({_id:x},{nickname:1,detalles:1,_id:0}).toArray()[0]])
		})
		return richList;
}})
