import { useState, useRef } from "react";


import './home.css'


import 'primereact/resources/themes/saga-blue/theme.css';


import 'primereact/resources/primereact.min.css';


import 'primeicons/primeicons.css';


import { InputText } from 'primereact/inputtext'


import { Password } from 'primereact/password';


import { Button } from 'primereact/button';


import { Card } from 'primereact/card'


import { Toast } from 'primereact/toast';
        
        
import { Link } from "react-router-dom";


import { auth, provider } from '../../FirebaseConnection'


import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'


import { useNavigate } from 'react-router-dom'


export default function Home(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function handleLogin(e){
        e.preventDefault();

        if(email !== '' && password !== ''){
            await signInWithEmailAndPassword(auth, email, password)
            .then(()=>{
                navigate('/admin', {replace: true})
            })
            .catch((error)=>{
                console.log(`ERRO: ${error}`)
                function errado(){
                    toast.current.show({severity:'warn', summary: 'ATENÇÃO', detail:'EMAIL OU SENHA INVALIDOS', life: 3000});
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

    async function googleLogin(e) {
        e.preventDefault();
        await signInWithPopup(auth, provider)
        .then(()=> {
            navigate('/admin', {replace: true})
        })
        .catch((error)=> {
            console.log(`ERRO: ${error}`)
        })
    }

    return(

        <div className="container">


            <div>
    
                <div className="card flex justify-content-center ">
                    <Card style={{height: '480px', alignItems: 'center'}} className="md">
                        <p>
                            <div style={{marginLeft: '50px'}}>
                                <h1>Login</h1>
                                
                            </div>

                            <div style={{marginLeft: '30px'}} >
                                <h3>Seja bem-vindo(a)</h3>
                                
                            </div><br/>
                           

                            <form className="form" onSubmit={handleLogin}>

                                    <div className="entradas">

                                        <div className="p-input-icon-right p-float-label">
                                        
                                            <InputText id="userEmail" 
                                                       autoComplete="off" 
                                                       value={email} 
                                                       onChange={(e) => setEmail(e.target.value)} />
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
                                        <div>
                                            <Toast ref={toast}/>
                                            <Button style={{width: '160px'}}
                                                label="Acessar"  
                                                type="submitt" 
                                                icon="pi pi-sign-in" 
                                                onClick={limpos}/>
                                        </div><br/>
                                        <div>

                                        <Toast ref={toast}/>
                                            <Button 
                                                label=" Acessar Google"
                                                onClick={googleLogin}
                                                icon="pi pi-google" 
                                            />
                                                
                                                
                                        </div>

                                        <Link style={{marginTop: '20px'}} to="/registro"> Cadastre-se </Link>
                                    </div>
                            
                                  
                            </form>
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    )
}