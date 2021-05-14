/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable quotes */
/* eslint no-use-before-define: 0 */

import React, { useContext } from 'react';
import api from '../../../services/api';
import { AppContext } from '../../login/hooks/context';
import {
  Container,
  Grid,
  makeStyles,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  Select
} from '@material-ui/core';
import Page from 'src/components/Page';
import Bud from './Budget';
import Budget from '../../../components/Budget';
import LatestOrders from '../../../components/LatestOrders';
import TasksProgress from './TasksProgress';
import TotalCustomers from './TotalCustomers';


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  formControl: {
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: 0,
  },
}));



const Dashboard = () => {
  const classes = useStyles();
  const [data, setData] = React.useState([{}]);
  const { data: dataContext } = useContext(AppContext);
  const [age, setAge] = React.useState('');
  const [province, setProvince] = React.useState('');
  const [selectedDoenca, setSelectedDoenca] = React.useState('');
  const [casoDoenca, setCasoDoenca] = React.useState('');
  const [doencas, setDoencas] = React.useState();
  const [confirmed, setConfirmed] = React.useState([7, 14, 16, 9, 15, 17, 20, 7, 14, 16, 9, 15, 17, 20, 22, 34, 21, 10]);
  const [deceased, setDeceased] = React.useState([5, 7, 20, 8, 10, 13, 10, 10, 7, 20, 8, 10, 13, 5, 20, 22, 34, 21, 10]);
  const [recovered, setRecovered] = React.useState([2, 4, 15, 5, 7, 8, 9, 8, 6, 14, 6, 8, 9, 3, 18, 19, 26, 17, 8])

  const datas = {
    // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: "Confirmados",
        type: "bar",
        data: confirmed,
        fill: false,
        fontColor: "#fff",
        borderColor: "#290212",
        backgroundColor: "#0066ff",
        pointBorderColor: "#0066ff",
        pointBackgroundColor: "#0066ff",
        pointHoverBackgroundColor: "#0066ff",
        pointHoverBorderColor: "#0066ff",
        yAxisID: "y-axis-2",
      },
      {
        type: "bar",
        label: "Mortos",
        data: deceased,
        fill: false,
        backgroundColor: "#ff4d4d",
        borderColor: "#ff4d4d",
        hoverBackgroundColor: "#ff4d4d",
        hoverBorderColor: "#ff4d4d",
        yAxisID: "y-axis-1",
      },
      {
        type: "bar",
        label: "Recuperados",
        data: recovered,
        fill: false,
        backgroundColor: "orange",
        borderColor: "orange",
        hoverBackgroundColor: "orange",
        hoverBorderColor: "orange",
        yAxisID: "y-axis-1",
      },
    ],
  };

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleProvince = (event) => {
    setProvince(event.target.value);
  };

  const handleDoenca = (event) => {
    setSelectedDoenca(event.target.value);

    api
      .get(`/casos/casosporprovincias/${event.target.value}`)
      .then((response) => {
        //  console.log(response.data);

        let recuperados = []
        let mortos = []
        let confirmados = []
        
        response && response.data.map((item, index) => {
          recuperados[index] = item.recuperados
          mortos[index] = item.mortos
          confirmados[index] = item.activos + item.mortos + item.recuperados
        })

        setRecovered(recuperados)
        setDeceased(mortos)
        setConfirmed(confirmados)
      });
  };

  React.useEffect(() => { 
 
    
    api
      .get(`/dados/${dataContext?.state?.usuario.id}`)
      .then((response) => {
        //  console.log(response.data);
        console.log(response);
        setData(response.data);
      });

      api
      .get(`/doencas`)
      .then((response) => {
        //  console.log(response.data);
        setDoencas(response.data);
      });
  
  }, []);

  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container maxWidth={false}>
        { (dataContext?.state?.usuario.tipo == "Admin") && (
            <>
              <Button
                color="primary"
                variant="contained"
                disabled={ !((age == 'casosporprovinciascinco') ? true : (age == "casospormunicipios" && province != '') ? true: (age == "casosporprovinciaspordoenca" && casoDoenca != '') ? true: false) }
                style={{ color: '#fff', "margin-bottom": "15px" }}
                onClick={() => (age == "casospormunicipios") ? window.open(`http://localhost/srad/relatorio/${age}/${province}`, '_blank')  : (age == "casosporprovinciaspordoenca") ? window.open(`http://localhost/srad/relatorio/${age}/${casoDoenca}`, '_blank') : window.open(`http://localhost/srad/relatorio/${age}`, '_blank') }
              >
              Gerar Relatório
            </Button>
            <FormControl style={{ color: '#fff', minWidth: 200, margin: '-10px 0px 15px 10px' }}>
              <InputLabel id="demo-simple-select-label">Tipo:</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                onChange={handleChange}
              >
                <MenuItem value="casosporprovinciascinco">Relatório Por Províncias</MenuItem>
                <MenuItem value="casospormunicipios">Relatório Por Municípios</MenuItem>
                <MenuItem value="casosporprovinciaspordoenca">Relatório Por Doenças </MenuItem>
              </Select>
            </FormControl>
            { age == '' ?
              
              <span style={{color: "#000"}}> <br/>Obs: Selecione o tipo de relatório para conseguir gerar</span>:
              ``
            }
            </>
        )
        }

        {(age == "casospormunicipios") &&

          (
            <FormControl style={{ color: '#fff', minWidth: 200, margin: '-10px 0px 15px 10px' }}>
              <InputLabel id="demo-simple-select-label">Província:</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={province}
                onChange={handleProvince}
              >
                <MenuItem value="1">Bengo</MenuItem>
                <MenuItem value="2">Benguela</MenuItem>
                <MenuItem value="3">Bié</MenuItem>
                <MenuItem value="4">Cabinda</MenuItem>
                <MenuItem value="5">Cunene</MenuItem>
                <MenuItem value="6">Huambo</MenuItem>
                <MenuItem value="7">Huíla</MenuItem>
                <MenuItem value="8">Cuando Cubango</MenuItem>
                <MenuItem value="9">Cuanza Norte</MenuItem>
                <MenuItem value="10">Cuanza Sul</MenuItem>
                <MenuItem value="11">Luanda</MenuItem>
                <MenuItem value="12">Lunda Norte</MenuItem>
                <MenuItem value="13">Lunda Sul</MenuItem>
                <MenuItem value="14">Malanje</MenuItem>
                <MenuItem value="15">Moxico</MenuItem>
                <MenuItem value="16">Namibe</MenuItem>
                <MenuItem value="17">UÍGE</MenuItem>
                <MenuItem value="18">Zaire</MenuItem>
              </Select>
            </FormControl>
          )
        }

        {(age == "casosporprovinciaspordoenca") &&

        (
          <FormControl style={{ color: '#fff', minWidth: 200, margin: '-10px 0px 15px 10px' }}>
            <InputLabel id="demo-simple-select-label">Doença:</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={casoDoenca}
              onChange={(e) => setCasoDoenca(e.target.value)}
            >
              { doencas &&
                doencas.map((item, index) => (
                  <MenuItem value={item.id}>{item.nome}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        )
        }
          
        <Grid
          container
          style={{ height: "85vh" , marginTop: "5px"}}
          spacing={3}
        >
          <Grid
            item
            lg={4}
            sm={6}
            xl={4}
            xs={12}
            
          >
            <Bud sala="30" />
          </Grid>
          <Grid
            item
            lg={4}
            sm={6}
            xl={4}
            xs={12}
          >
            <TotalCustomers utentes="17.478.000" />
          </Grid>
          <Grid
            item
            lg={4}
            sm={6}
            xl={4}
            xs={12}
          >
            <TasksProgress cat="5.234.000" />
          </Grid>
          <Grid item lg={8} md={12} xl={9} xs={12}>
          { (dataContext?.state?.usuario.tipo == "Admin") && (
            <>
            <FormControl style={{ color: '#fff', minWidth: 200, margin: '-10px 0px 15px 10px' }}>
              <InputLabel id="demo-simple-select-label">Doença</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedDoenca}
                onChange={handleDoenca}
              >
                { doencas &&
                  doencas.map((item, index) => (
                    <MenuItem value={item.id}>{item.nome}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            {/* age == '' ?
              
              <span style={{color: "#000"}}> <br/>Obs: Selecione o tipo de relatório para conseguir gerar</span>:
              ``
          */}
            </>
        )
        }
            <LatestOrders
              data={datas}
              label={[
                "Bengo",
                "Benguela",
                "Bié",
                "Cabinda",
                "Cunene",
                "Huambo",
                "Huíla",
                "Cuando-Cubango",
                "Cuanza-Norte",
                "Cuanza-Sul",
                "Luanda",
                "Lunda-Norte",
                "Lunda-Sul",
                "Malanje",
                "Moxico",
                "Namibe",
                "Uíge",
                "Zaire"
              ]}
            />
          </Grid>
            <Grid item lg={4} md={6} xl={3} xs={12}>
              <Budget
                data={{
                  labels: [
                    "Malária",
                    "Covid",
                    "Câncer",
                  ],
                  datasets: [
                    {
                      data: [60, 20, 20],
                      backgroundColor: [
                        "#ff4d4d",
                        "#ff8d9d",
                        "#ff10d3",
                      ],
                      hoverBackgroundColor: [
                        "#ff4d4d",
                        "#ff8d9d",
                        "#ff10d3",
                      ],
                    },
                  ],
                }}
              />
            </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
