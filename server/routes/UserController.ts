//importar objetos desde express
import {Router, Request, Response} from "express";

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/connect4');

function consulta(query: string, res: Response) {
    mongoose.connection.db.eval(query)
        .then(result =>{
            res.json(result);
    })
        .catch(err =>{
            res.json(err);
    });
}

class ControladorPersona{
    router : Router;
    constructor(){
        this.router = Router();
        this.routes();
    }

    public static crearUsuario(req: Request, res: Response){
        let idUsuario = req.body.idUsuario;
        let nick = req.body.nick;
        let det = req.body.det;
        consulta("cUsuario('"+idUsuario+"','"+nick+"','"+det+"')",res);
    }

    public static chat(req: Request, res: Response){
        let idEmisor    = req.body.idEmisor;
        let idReceptor  = req.body.idReceptor;
        let msg         = req.body.msg;
        consulta("chat('"+idEmisor+"','"+idReceptor+"','"+msg+"')",res);
    }

    public static getChat(req: Request, res: Response){
        let idOne   = req.query.idOne;
        let idTwo   = req.query.idTwo;
        consulta("getChatLog('"+idOne+"','"+idTwo+"')",res);
    }

    public  static setDetails(req: Request, res: Response){
        let idUsuario = req.body.idUsuario;
        let det = req.body.det;
        consulta("uDetalles('"+idUsuario+"','"+det+"')", res);
    }

    public static changeNick(req: Request, res: Response){
        let idUsuario = req.body.idUsuario;
        let nick = req.body.nick;
        consulta("uNickname('"+idUsuario+"','"+nick+"')", res);
    }

    public static checkUsuario(req: Request, res: Response){
        let idUsuario = req.query.idUsuario;
        consulta("checkUsuario('"+idUsuario+"')", res);
    }

    public static gameListFilter(req: Request, res: Response){
        let idUsuario = req.query.idUsuario;
        let filtro = req.query.filtro;
        mongoose.connect('mongodb://localhost:27017/connect4')
        .then(() =>{
            mongoose.connection.db.eval("gameListFilter('"+idUsuario+"',"+filtro+")")
            .then(result0 =>{
                if(result0[0] ==null)
                    res.json(result0);
                else
                    result0.forEach(element => {
                        mongoose.connection.db.eval("getInfoPartida("+element+")").then(result1 =>{
                            mongoose.connection.db.eval("checkUsuario('"+result1.usuarios[0][0]+"')").then(user0 =>{
                                mongoose.connection.db.eval("checkUsuario('"+result1.usuarios[1][0]+"')").then(user1 =>{
                                    res.json({"id_partida":element,"Jugador_1":user0,"colors":[result1.usuarios[0][1],result1.usuarios[1][1]],"Jugador_2":user1,"tamano":result1.tamano,"linea":result1.tamano_linea})
                                })
                            })
                        })
                    })
            })
        })
    }

    public static rondaActiva(req: Request, res: Response){
        let idPartida = req.query.idPartida;
        consulta("rondaActiva("+idPartida+")", res);
    }
    public routes(): void{
        this.router.post('/crearUsuario',ControladorPersona.crearUsuario);
        this.router.post('/enviarMsg',ControladorPersona.chat);
        this.router.get('/getChatlog',ControladorPersona.getChat);
        this.router.post('/setDetails',ControladorPersona.setDetails);
        this.router.post('/changeNick',ControladorPersona.changeNick);
        this.router.get('/checkUsuario',ControladorPersona.checkUsuario);
        this.router.get('/gameListFilter',ControladorPersona.gameListFilter);
        this.router.get('/rondaActiva',ControladorPersona.rondaActiva);
    }
}

const personCTRL = new ControladorPersona();
const router = personCTRL.router;
export default router;