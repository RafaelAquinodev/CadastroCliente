import { useState, useRef, useEffect } from 'react';
import './admin.css'
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputMask } from 'primereact/inputmask';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { addLocale } from 'primereact/api';
import { Card } from 'primereact/card';
import { auth, db } from '../../FirebaseConnection';
import { signOut } from 'firebase/auth';
import { addDoc, collection, query, where, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Fragment } from 'react';
import axios from 'axios';




function Admin() {

     const toast = useRef(null);
     const [visible, setVisible] = useState(false);
     const [items, setItems] = useState([]);
    const [sexo, setSexo] = useState('')

    const gender = [
        "Masculino",
        "Feminino",
        "Personalizado"

    ];

    const [nome, setNome] = useState('');
    const [sobreNome, setSobreNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [rg, setRg] = useState('');
    const [data, setData] = useState('');
    const [cep, setCep] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [bairro, setBairro] = useState('');
    const [numero, setNumero] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUf] = useState('');
    const [complemento, setComplemento] = useState('');
    const [referencia, setReferencia] = useState('');
    const [registros, setRegistros] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [nameSelected, setnameSelected] = useState('');
    const [nomeTwo, setnomeTwo] = useState('');
    const [sobrenomeTwo, setsobrenomeTwo] = useState('');
    const [dataTwo, setdataTwo] = useState('');
    const [id, setId] = useState('');
    const [test, setTest] = useState('');
    const [edit, setEdit] = useState({});
    const [user, setUser] = useState('');

    const toastCpf = () => {
        toast.current.show({ severity: 'warn', summary: 'ATENÇÃO', detail: 'CPF INVÁLIDO' });
    };

    function hide() {
        setVisible(false);
        setSexo('Sexo');
    }

    function limpaCampos() {

        setNome('');
        setSobreNome('');
        setCpf('');
        setRg('');
        setSexo('');
        setData('');
        setCep('');
        setLogradouro('');
        setBairro('');
        setNumero('');
        setCidade('');
        setUf('');
        setComplemento('');
        setReferencia('');
    }

    useEffect(() => {
        async function registro() {
            const userDetail = localStorage.getItem("@user")
            setUser(JSON.parse(userDetail))

            if (userDetail) {
                const data = JSON.parse(userDetail);

                const registroRef = collection(db, "registros")
                const q = query(registroRef, where("userUid", "==", data?.uid))

                const unsub = onSnapshot(q, (snapshot) => {
                    let lista = [];

                    snapshot.forEach((doc) => {
                        console.log("forEach");
                        console.log(doc.data().data);
                        console.log("forEach");
                        lista.push({
                            id: doc.id,
                            nome: doc.data().nome,
                            sobrenome: doc.data().sobrenome,
                            cpf: doc.data().cpf,
                            rg: doc.data().rg,
                            sexo: doc.data().sexo,
                            data: doc.data().data,
                            cep: doc.data().cep,
                            logradouro: doc.data().logradouro,
                            bairro: doc.data().bairro,
                            numero: doc.data().numero,
                            cidade: doc.data().cidade,
                            uf: doc.data().uf,
                            complemento: doc.data().complemento,
                            referencia: doc.data().referencia,
                            userUid: doc.data().userUid
                        })
                    })

                    //console.log(lista);
                    setRegistros(lista);


                })

            }

        }

        registro();
    }, [])



    useEffect(() => {
        async function loadTarefas() {
            const userDetail = localStorage.getItem("@user")
            setUser(JSON.parse(userDetail))
        }

        loadTarefas();
    }, [])


    async function salvar(e) {

        e.preventDefault();
        console.log("salvar");
        console.log(data);
        if (nome, sobreNome, cpf, rg, sexo, data, cep, logradouro, bairro, numero, cidade, uf, complemento, referencia === '') {
            toast.current.show({ severity: 'warn', summary: 'ATENÇÃO', detail: 'Erro ao Registrar', life: 3000 });

            return;
        }

        if (nameSelected) {
            updatebotton();
            setnameSelected('');
            return
        }




        await addDoc(collection(db, "registros"), {
            nome: nome,
            sobrenome: sobreNome,
            cpf: cpf,
            rg: rg,
            sexo: sexo,
            data: FormateDataStr(data),
            cep: cep,
            logradouro: logradouro,
            bairro: bairro,
            numero: numero,
            cidade: cidade,
            uf: uf,
            complemento: complemento,
            referencia: referencia,
            userUid: user?.uid,
        })
            .then(() => {
                limpaCampos();
                //console.log('tarefas registrada')
            })
            .catch((error) => {
                //console.log("erro ao registrar" + error)
            })

        setVisible(false);


    }



    function testaCpf(strCPF) {
        var Soma;
        var Resto;
        Soma = 0;
        if (strCPF === "00000000000") return false;

        for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto === 10) || (Resto === 11)) Resto = 0;
        if (Resto !== parseInt(strCPF.substring(9, 10))) return false;

        Soma = 0;
        for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto === 10) || (Resto === 11)) Resto = 0;
        if (Resto !== parseInt(strCPF.substring(10, 11))) return false;
        return true;
    }

    function validaCpf(cpf) {
        setCpf(cpf);
        //console.log(cpf);
        cpf = cpf.replace('.', '');
        cpf = cpf.replace('.', '');
        cpf = cpf.replace('-', '');
        //console.log(cpf)
        if (!testaCpf(cpf)) {
            toast.current.show({ severity: 'warn', summary: 'ATENÇÃO', detail: 'CPF invalido', life: 3000 });
            setCpf('');
        }

    }

    function validacep(cep) {
        setCep(cep);
        cep = cep.replace('-', '');
        //console.log(cep)

        async function getCep(cep) {
            await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
                .then((resposta) => {
                    setLogradouro(resposta.data.logradouro);
                    setBairro(resposta.data.bairro);
                    setCidade(resposta.data.localidade);
                    setUf(resposta.data.uf);
                })
                .catch((erro) => {
                    toast.current.show({ severity: 'warn', summary: 'ATENÇÃO', detail: 'CEP invalido', life: 3000 });
                    setCep('');

                })
        }
        getCep(cep);
    }
    function abriForm() {
        setVisible(true);
        limpaCampos();

    }

    function FormateData(data) { 
        console.log("FormateData2");
        console.log(data);
        console.log("FormateData2");
        let res = data;
        let dataArray = res.split("/");
        console.log("dataArray");
        console.log(dataArray);
        console.log("dataArray");
        let dia = dataArray[0]
        let mes = dataArray[1]
        let ano = dataArray[2]
        console.log("FormateData");
        console.log(data);
        console.log("FormateData");
        console.log("FormateData1");
        console.log(ano);
        console.log(mes);
        console.log(dia);
        console.log("FormateData1"); 
        return  new Date(+ano,mes-1,dia);
    }

    function FormateDataStr() {
        if (data != "") {
            //console.log("FormateData");
            let date, month, year, inputDate;
            inputDate = data;
            date = inputDate.getDate();
            month = inputDate.getMonth() + 1;
            year = inputDate.getFullYear();

            date = date
                .toString()
                .padStart(2, '0');

            month = month
                .toString()
                .padStart(2, '0');

            return `${date}/${month}/${year}`;
        }
        else
            return "";
    }


    function validaData(data1) {
        //console.log("validaData");
        //console.log(data1);
        // setData(data1);
        // //console.log(data1);
        // //console.log("data1");
        // let res = data1.toString();
        // let dataArray = res.split(" ");
        // let dia = dataArray[2]
        // let mes = dataArray[1]
        // let ano = dataArray[3]

        // switch(mes){
        //     case "Jan":
        //         mes = '01';
        //         break;
        //     case "Feb":
        //         mes = '02'
        //         break;
        //     case "Mar":
        //         mes = '03'
        //         break;
        //     case "Apr":
        //         mes = '04'
        //         break;
        //     case "May":
        //         mes = '05'
        //         break;
        //     case "Jun":
        //         mes = '06'
        //         break;
        //     case "jul":
        //         mes = '07'
        //         break;
        //     case "Aug":
        //         mes = '08'
        //         break;
        //     case "Sep":
        //         mes = '09'
        //         break;
        //     case "Oct":
        //         mes = '10'
        //         break;
        //     case "Nov":
        //         mes = '11'
        //         break;
        //     case "Dec":
        //         mes = '12'
        //         break;
        // }
        // let dataCompleta = `${dia}/${mes}/${ano}`
        // ////console.log(dataCompleta);
        // ////console.log(data);
        // setData('');
        setData(data1);
        return data1;


    }

    let maxDate = new Date();
    let today = new Date();
    let day = today.getDate();
    maxDate.setDate(day)
    addLocale('es', {
        firstDayOfWeek: 1,
        dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
        dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
        monthNames: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
        monthNamesShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
        today: 'Hoy',
        clear: 'Limpiar'
    });



    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">

            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Pesquisar" />
            </span>

            <InputText value={nomeTwo} style={{ marginLeft: "40px", color: "dodgerblue" }} placeholder='Nome' />
            <InputText value={sobrenomeTwo} style={{ marginLeft: "40px", color: "dodgerblue" }} placeholder='Sobrenome' />
            <InputText value={dataTwo} style={{ marginLeft: "40px", color: "dodgerblue" }} placeholder='Data de Nascimento' />


            <Button style={{ marginLeft: "80px" }} label="Cadastrar " icon="pi pi-sign-in" onClick={abriForm} />

            <Button style={{ marginLeft: "120px" }} label='Sair' icon="pi pi-sign-out" severity='danger' onClick={logout} />
        </div>
    );
    function updateForm(e) {
        setnameSelected('oi');
        setNome(e.nome);
        setSobreNome(e.sobrenome);
        setCpf(e.cpf);
        setRg(e.rg);
        setSexo(e.sexo);
        console.log("e.data");
        console.log(e.data);
        console.log("e.data");
        setData(FormateData(e.data));
        setCep(e.cep);
        setLogradouro(e.logradouro);
        setBairro(e.bairro);
        setNumero(e.numero);
        setCidade(e.cidade);
        setUf(e.uf);
        setComplemento(e.complemento);
        setReferencia(e.referencia);
        setVisible(true);
        setEdit('oi')
        setId(e.id);
        setnomeTwo('')
        setsobrenomeTwo('');
        setdataTwo('');
    }

    async function updatebotton() {
        //console.log(id)
        console.log("updatebotton")
        console.log(FormateDataStr(data))
        const userDetail = localStorage.getItem("@user")
        setUser(JSON.parse(userDetail));

        const docRef = doc(db, "registros", id)
        await updateDoc(docRef, {
            nome: nome,
            sobrenome: sobreNome,
            cpf: cpf,
            rg: rg,
            sexo: sexo,
            data: FormateDataStr(data),
            cep: cep,
            logradouro: logradouro,
            bairro: bairro,
            numero: numero,
            cidade: cidade,
            uf: uf,
            complemento: complemento,
            referencia: referencia,
            userUid: user?.uid,
        })
            .then(() => {
                //console.log("registro atualizado")
                setVisible(false);

            })
            .catch(() => {
                //console.log('erro')
            })
    }

    function onRowSelect(e) {
        setnomeTwo(e.data.nome);
        setsobrenomeTwo(e.data.sobrenome);
        setdataTwo(e.data.data);
        //console.log(e);
    }

    function onRowUnselect() {
        setnomeTwo('');
        setsobrenomeTwo('');
        setdataTwo('');
    }

    async function logout() {
        await signOut(auth);
    }

    async function deleteRegistro() {

        const docRef = doc(db, "registros", id)
        //console.log(id);
        await deleteDoc(docRef);
        setnomeTwo('');
        setsobrenomeTwo('');
        setdataTwo('');
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <Fragment>
                <Button label='Editar' icon="pi pi-pencil" className='update' onClick={() => updateForm(rowData)} />
                <Button label='Excluir' icon="pi pi-trash" severity='danger' className='delete' onClick={() => deleteRegistro(rowData)} />
            </Fragment>
        );
    };

    return (
        <div>


            <div>
                <DataTable value={registros} onRowSelect={onRowSelect} onRowUnselect={onRowUnselect} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)} globalFilter={globalFilter} header={header} paginator rows={5}
                    style={{ width: '1400px', marginLeft: '200px' }} >
                    <Column selectionMode="single" exportable={false}></Column>
                    <Column field="nome" header="Nome" sortable filter filterPlaceholder="Search" style={{ alignItems: 'center' }}></Column>
                    <Column field="sobrenome" header="Sobrenome" sortable filter filterPlaceholder="Search" style={{ alignItems: 'center' }} ></Column>
                    <Column field="cpf" header="CPF" sortable filter filterPlaceholder='Search CPF' style={{ alignItems: 'center' }} ></Column>
                    <Column field="rg" header="RG" sortable filter filterPlaceholder='Search RG' style={{ alignItems: 'center' }} ></Column>
                    <Column field="sexo" header="Sexo" sortable filter filterPlaceholder='Search sexo' style={{ alignItems: 'center' }}></Column>
                    <Column field="data" header="Data de Nascimento" filter sortable style={{ alignItems: 'center' }} ></Column>
                    <Column field="cidade" header="Cidade" sortable filter filterPlaceholder='Search Cidade' style={{ alignItems: 'center' }}></Column>
                    <Column header="Ações" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>


                </DataTable>



            </div>

            <div className='card flex justify-content-center'>
                <Dialog className='dialog' visible={visible} style={{ width: '40vw', height: '35vw' }} onHide={hide}>

                    <div style={{ color: 'dodgerblue', textAlign: 'center', marginTop: '-30px' }}>
                        <h1>Cadastro de Cliente </h1>
                    </div>

                    <form onSubmit={salvar}>
                        <div className='dialog'>
                            <div className='colunas'>
                                <div><InputText placeholder='Nome'
                                    value={nome}
                                    keyfilter='alpha'
                                    onChange={(e) => setNome(e.target.value)}
                                    minLength={3}
                                    style={{ borderRadius: '8px', borderColor: 'dodgerblue' }}
                                    required />
                                </div><br />
                                <div>
                                    <InputText placeholder='Sobrenome'
                                        value={sobreNome}
                                        minLength={3}
                                        keyfilter='alpha'
                                        style={{ borderRadius: '8px', borderColor: 'dodgerblue' }}
                                        onChange={(e) => setSobreNome(e.target.value)}
                                        required />

                                </div><br />
                                <div>
                                    <Toast ref={toast} />
                                    {Object.keys(nameSelected).length > 0 ? (
                                        <InputMask
                                            id='cpf'
                                            placeholder='CPF'
                                            value={cpf}
                                            mask="999.999.999-99"
                                            onBlur={(e) => validaCpf(e.target.value)}
                                            style={{ borderRadius: '8px', borderColor: 'dodgerblue' }}
                                            required />
                                    ) : (

                                        <InputMask
                                            id='cpf'
                                            placeholder='CPF'
                                            mask="999.999.999-99"
                                            onBlur={(e) => validaCpf(e.target.value)}
                                            style={{ borderRadius: '8px', borderColor: 'dodgerblue' }}
                                            required />

                                    )
                                    }

                                </div><br />
                                <div>
                                    <InputText placeholder='RG'
                                        value={rg}
                                        keyfilter='num'
                                        style={{ borderRadius: '8px', borderColor: 'dodgerblue' }}
                                        maxLength={8}
                                        onChange={(e) => setRg(e.target.value)} />

                                </div><br />
                                <div >
                                    <Dropdown value={sexo}
                                        onChange={(e) => setSexo(e.value)}
                                        options={gender}
                                        placeholder="Sexo"
                                        style={{ width: "200px", borderRadius: '8px', borderColor: 'dodgerblue' }} />
                                </div><br />
                                <div>
                                    {Object.keys(nameSelected).length > 0 ? (

                                        <InputMask
                                            id='cep'
                                            placeholder='CEP'
                                            value={cep}
                                            mask='99999-999'
                                            onBlur={(e) => validacep(e.target.value)}
                                            style={{ borderRadius: '8px', borderColor: 'dodgerblue' }}
                                        />


                                    ) : (
                                        <InputMask
                                            id='cep'
                                            placeholder='CEP'
                                            mask='99999-999'
                                            onBlur={(e) => validacep(e.target.value)}
                                            style={{ borderRadius: '8px', borderColor: 'dodgerblue' }}
                                        />
                                    )
                                    }

                                </div><br />
                                <div>
                                    <Calendar
                                        value={data}
                                        maxDate={maxDate}
                                        placeholder='Data de nascimento'
                                        onChange={(e) => setData(e.value)}
                                        dateFormat='dd/mm/yy'
                                        locale='es'
                                        readOnlyInput
                                        showIcon
                                        style={{ width: '200px', borderRadius: '8px' }}
                                        required />

                                </div>

                            </div>
                            <div className='colunas2'>

                                <div>
                                    <InputText placeholder='Logradouro'
                                        value={logradouro}
                                        style={{ borderRadius: '8px', borderColor: 'dodgerblue' }}
                                        onChange={(e) => setLogradouro(e.target.value)} />

                                </div><br />
                                <div><InputText placeholder='Bairro'
                                    value={bairro}
                                    style={{ borderRadius: '8px', borderColor: 'dodgerblue' }}
                                    onChange={(e) => setBairro(e.target.value)} />
                                </div><br />
                                <div><InputText placeholder='cidade'
                                    value={cidade}
                                    style={{ borderRadius: '8px', borderColor: 'dodgerblue' }}
                                    onChange={(e) => setCidade(e.target.value)} />
                                </div><br />

                                <div>
                                    <InputText placeholder='Numero'
                                        value={numero}
                                        keyfilter='num'
                                        style={{ borderRadius: '8px', borderColor: 'dodgerblue' }}
                                        onChange={(e) => setNumero(e.target.value)} />
                                </div><br />

                                <div>
                                    <InputText placeholder='UF'
                                        value={uf}
                                        keyfilter='alpha'
                                        style={{ borderRadius: '8px', borderColor: 'dodgerblue' }}
                                        maxLength={2}
                                        minLength={2}
                                        onChange={(e) => setNumero(e.target.value)} />

                                </div><br />
                                <div> <InputText placeholder='Complemento'
                                    value={complemento}
                                    style={{ borderRadius: '8px', borderColor: 'dodgerblue' }}
                                    onChange={(e) => setComplemento(e.target.value)} />
                                </div><br />

                                <div>

                                    <InputText placeholder='Ponto de referencia'
                                        value={referencia}
                                        style={{ borderRadius: '8px', borderColor: 'dodgerblue' }}
                                        onChange={(e) => setReferencia(e.target.value)} />

                                </div><br />

                            </div>
                        </div>
                        <div>
                            <div className='btn-dentro'>
                                <Button label="Cancelar" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
                            </div>
                            <div className='btn-two'>
                                {Object.keys(nameSelected).length > 0 ? (
                                    <Button label="Atualizar" type='submit' icon="pi pi-pencil" autoFocus />
                                ) : (
                                    <Button label="Salvar" type='submit' icon="pi pi-save" autoFocus />
                                )}


                            </div>
                        </div>

                    </form>
                </Dialog>
            </div>
        </div>


    )

}
export default Admin;