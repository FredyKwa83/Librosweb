const fs = require('fs');
const path = require('path');
const {all,findByField,generate,write} = require('../models/usersModel');

const {validationResult} = require('express-validator');

const db = require ('../database/models')

const bcrypt = require('bcryptjs');

const librosFilePath = path.join(__dirname, '../database/librosDataBase.json');
let libros = JSON.parse(fs.readFileSync(librosFilePath, 'utf-8'));
const usuariosFilePath = path.join(__dirname, '../database/usuarios.json');
let usuarios = JSON.parse(fs.readFileSync(usuariosFilePath, 'utf-8'));

const userController ={

    register: (req, res) => {
            res.render('register');
    },

	registerPOST: (req, res) => {
        const resultValidation = validationResult(req)

        if (resultValidation.errors.length > 0) { 
            return res.render('register' , {errors: resultValidation.mapped() , old : req.body})
        } else {
			/*let user = generate(req.body);
			let allUsers = all();
			allUsers.push(user);
			write(allUsers);

			return res.render('login');*/

            db.usuario.create({
                nombre: req.body.nombre,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10),
                username: req.body.username,
                rol: req.body.rol,
            })

            res.render('login'); 

		}
	},

    login :(req, res) => {
        //res.sendFile((__dirname + '/views/login.html'));
        res.render('login');
    },

	loginPOST : async(req, res) => {
		
		//let userToLogin = findByField('username', req.body.usernameLogin)

        try {
            const userToLogin = await db.usuario.findOne({where: {username: req.body.username}});
            console.log("Nombre de usuario: ", userToLogin)

            const correctPassword = bcrypt.compareSync(req.body.password, userToLogin.password);
            console.log("Contraseña correcta: ", correctPassword)
            if (correctPassword){
                req.session.userLogged = userToLogin;
                return res.redirect("perfil");
            } else {
                return res.send("Credenciales incorrectas")
            }
            
            /*} else {
                res.render("/login", {errors: {log: {msg: "Credencial no válida"}}});
            }*/




               /* if (req.body.username == usuarios.username){
                        let correctPassword = bcrypt.compareSync(req.body.password, usuarios.password);
                    if (correctPassword) {
                // delete userToLogin.password
                // req.session.userLogged = userToLogin

                // if (req.body.remember) {
                //     res.cookie('userEmail' , req.body.email, {maxAge : (((1000 * 60) * 60)*24)}) // cookie de 24 hs
                // }

                    return res.send('Bienvenido');
                    res.cookie("login", "Hola usuario")
                } else {
                    return res.render('login' , {
                    errors: {
                        password: {
                            msg: 'Contraseña incorrecta'
                        }
                    },
                    old : req.body
                })
             }
                } else {
                 return res.render('login' , {
                    errors: {
                    username: {
                        msg: 'El usuario con el que intenta ingresar no existe'
                    }
                }})
                    }*/
                
        /*)*/}
        catch (error) { 
            console.log(error.message); 
        }
        
            
	},

    perfil : async(req,res) => {
        /*let id = req.params.id
        usuarios = JSON.parse(fs.readFileSync(usuariosFilePath, 'utf-8'));
        usuarios = usuarios.find(usuario => usuario.id == id);
        if (usuarios){
        res.render('perfil', {usuarios: usuarios});
        }*/

        
        try {
            return res.render('perfil', {usuario: req.session.userLogged});
        }
        catch (error) { 
            console.log(error.message); 
        }
    },

    create: (req, res) => {
        db.categoria.findAll()
            .then(function(generos){
                return res.render('libro-create-form', {generos: generos});
            })
	},
    store: (req, res) =>{
       /* let datosFormulario = req.body;
		let idNuevoLibro = (libros[libros.length-1].id)+1; // obtener un id (acordate por que +1)
		// console.log(idNuevoLibro); // verificar antes de continuar

		let objNuevoLibro = {
			id: idNuevoLibro,
			titulo: datosFormulario.titulo,
			precio: parseInt(datosFormulario.precio),
			descuento: parseInt(datosFormulario.descuento),
			genero: datosFormulario.genero,
			descripcion: datosFormulario.descripcion,
			imagen: "https://images.cdn1.buscalibre.com/fit-in/360x360/a3/5d/a35d90ab325ce95ac1eb3ab1775c04f6.jpg"
		}

		libros.push(objNuevoLibro);

		fs.writeFileSync(librosFilePath, JSON.stringify(libros,null,' '));

		res.redirect('/'); // manda el producto al index*/


        db.libro.create({
            nombre: req.body.titulo,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            descuento: req.body.descuento
            
        });

        res.redirect('/'); // manda el producto al index

        
    }



}

module.exports = userController;