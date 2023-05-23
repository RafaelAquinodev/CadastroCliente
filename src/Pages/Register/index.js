import { useState, useRef } from "react";


import './register.css'


import 'primereact/resources/themes/saga-blue/theme.css';


import 'primereact/resources/primereact.min.css';


import 'primeicons/primeicons.css';


import { InputText } from 'primereact/inputtext'


import { Password } from 'primereact/password';


import { Button } from 'primereact/button';


import { Card } from 'primereact/card'


import { Toast } from 'primereact/toast';
        
        
import { Link } from "react-router-dom";


import { auth } from '../../FirebaseConnection'


import { createUserWithEmailAndPassword } from "firebase/auth";


import { useNavigate } from 'react-router-dom'


export default function Register(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function handleRegister(e){
        e.preventDefault();

        if(email !== '' && password !== ''){
            await createUserWithEmailAndPassword(auth, email, password)
            .then(()=>{
                navigate('/admin', {replace: true})
            })
            .catch((error)=>{
                console.log(`ERRO: ${error}`)
                function errado(){
                    toast.current.show({severity:'warn', summary: 'ATENÇÃO', detail:'Erro ao fazer o cadastro', life: 3000});
                }
                errado();
                
            })

        }

    }

    


    const toast = useRef(null);
    const limpos = () => {
        if(email === '' || password === ''){
            toast.current.show({severity:'warn', summary: 'ATENÇÃO', detail:'Algum Campo Não Foi Informado', life: 3000});
        }
    }



    return(

        <div className="container">


            <div>
                <div className="card flex justify-content-center ">
                    <Card  className="md">
                        <p>
                            <div className="titulo">
                                <h1>Cadastre-se</h1>
                                <h3>Criar sua conta</h3>
                            </div><br/>
                           

                            <form className="form" onSubmit={handleRegister}>

                                    <div className="entradas">

                                        <div className="p-input-icon-right p-float-label">
                                        
                                            <InputText id="userEmail" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} />
                                            
                                            <label htmlFor="userEmail">Email</label>
                                        </div>
                                            

                                        <div className="senha">
                                            <div className="p-float-label">
                                                <Password  id="userSenha"
                                                            value={password} 
                                                            feedback={false}
                                                            onChange={(e) => setPassword(e.target.value)} 
                                                            toggleMask/>
                                                <label  htmlFor="userSenha">Senha</label>
                                            </div>
                                        </div>
                                    </div>



                                    <div className="btn">
                                        <div className="btn-space">
                                            <Toast ref={toast}/>
                                            <Button className="submit" 
                                                    label="Cadastrar" 
                                                    type="submit" 
                                                    icon="pi pi-user" 
                                                    onClick={limpos}/>

                                    
                                        </div>

                                        <Link className="button-link" to="/"> Ja possui uma conta? Faça Login. </Link>
                                    </div>
                            
                                  
                            </form>
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    )
}