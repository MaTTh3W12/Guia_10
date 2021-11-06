import * as React from "react";
import {
  SafeAreaView,
  Button,
  View,
  Text,
  Image,
  TouchableOpacity,
  Keyboard,
  Alert,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";
import { createAppContainer, NavigationEvents } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
class PantallaInicio extends React.Component {
  state = {
    usuario: "",
    contrasena: "",
  };
  static navigationOptions = {
    header: null,
  };
  Entrar() {
    if (!!this.state.usuario && !!this.state.contrasena) {
      fetch(
        "https://guia10-dps-mat.000webhostapp.com/apiusuario.php?comando=autenticar&usuario=" +
          this.state.usuario +
          "&contrasena=" +
          this.state.contrasena,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          const encontrado = responseJson.encontrado;
          // Alert("Mensaje="+mensaje);
          if (encontrado == "si") {
            this.props.navigation.navigate("ListarProductos");
          } else {
            Alert.alert(
              "Usuario",
              "No encontrado!!",
              [{ text: "OK", onPress: () => console.log("OK Pressed") }],
              { cancelable: false }
            );
          }
        })
        .catch((error) => {
          console.error(error);
          Alert.alert(
            "Aviso",
            "Error de Internet!!",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: false }
          );
        });
    } else {
      Alert.alert(
        "Aviso",
        "No introdujo datos",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    }
  }
  render() {
    return (
      <View style={{ flex: 1, padding: 10 }}>
        <Text style={{ fontSize: 34, marginTop: 25, alignSelf: "center" }}>
          Bienvenidos
        </Text>
        <Image
          style={{
            width: 200,
            height: 160,
            alignSelf: "center",
            marginTop: 15,
          }}
          source={require("./imagenes/market.png")}
        />
        <View style={{ marginLeft: 10, marginRight: 10 }}>
          <Input
            placeholder="USUARIO"
            onChangeText={(text) => this.setState({ usuario: text })}
            rightIcon={<Icon name="user" size={24} color="black" />}
          />
          <Input
            placeholder="CONTRASEÑA"
            onChangeText={(text) => this.setState({ contrasena: text })}
            secureTextEntry={true}
            rightIcon={<Icon name="lock" size={24} color="black" />}
          />
        </View>
        <TouchableOpacity
          style={{
            height: 50,
            backgroundColor: "red",
            marginTop: 15,
            borderRadius: 5,
            justifyContent: "center",
            marginLeft: 20,
            marginRight: 20,
          }}
          onPress={() => {
            this.Entrar();
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 22,
              textAlign: "center",
              textAlignVertical: "center",
            }}
          >
            Entrar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
class listarProductos extends React.Component {
  state = {
    elementos: [],
    total: 0,
  };
  static navigationOptions = {
    title: "Clientes",
    headerStyle: {
      backgroundColor: "#f4511e",
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
    },
  };
  cargarRegistros() {
    console.log("Prueba");
    fetch("https://guia10-dps-mat.000webhostapp.com/api.php?comando=listar", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        const listado = responseJson.records;
        console.log(listado);
        this.setState({
          elementos: listado,
          total: listado.length,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents
          onWillFocus={() => {
            // Do your things here
            this.cargarRegistros();
          }}
        />
        <Text
          style={{
            fontSize: 18,
            textAlign: "center",
            height: 40,
            marginTop: 10,
            backgroundColor: "lightgray",
            textAlignVertical: "center",
            borderRadius: 10,
            marginLeft: 10,
            marginRight: 10,
          }}
        >
          {this.state.total}
          clientes
        </Text>
        <FlatList
          data={this.state.elementos}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.id}
              //onPress = {() => this.alertItemName(item)}
              onPress={() => this.props.navigation.navigate("Detalles", item)}
            >
              <View
                style={{ flexDirection: "row", marginTop: 15, marginLeft: 2 }}
              >
                <View style={{ height: 80, marginLeft: 5 }}>
                  <Text style={{ flex: 1, fontSize: 18 }}>{item.nombre}</Text>
                  <Text style={{ flex: 1, fontSize: 16, fontWeight: "bold" }}>
                    ${item.email}
                  </Text>
                  <Text style={{ flex: 1, fontSize: 14 }}>
                    Existencia {item.telefono}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.2)",
            alignItems: "center",
            justifyContent: "center",
            width: 70,
            position: "absolute",
            bottom: 10,
            right: 10,
            height: 70,
            backgroundColor: "red",
            borderRadius: 100,
          }}
          onPress={() => this.props.navigation.navigate("Agregar")}
        >
          <Icon name="plus" size={30} color="white" />
        </TouchableOpacity>
      </View>
    );
  }
}
class PaginaDetalle extends React.Component {
  state = {
    direccion_postal: "",
    direccion_trabajo: "",
    email: "",
    nivel_economico: "",
    nombre: "",
    telefono: "",
    id: "",
  };
  static navigationOptions = {
    title: "Editar cliente",
    headerStyle: {
      backgroundColor: "#f4511e",
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
    },
  };
  Actualizar() {
    fetch(
      "https://guia10-dps-mat.000webhostapp.com/api.php?comando=editar&direccion_postal=" +
        this.state.direccion_postal +
        "&direccion_trabajo=" +
        this.state.direccion_trabajo +
        "&email=" +
        this.state.email +
        "&nivel_economico=" +
        this.state.nivel_economico +
        "&nombre=" +
        this.state.nombre +
        "&telefono=" +
        this.state.telefono +
        "&id=" +
        this.state.id,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        const mensaje = responseJson.mensaje;
        console.log(mensaje);
        if (!mensaje) alert("Error al actualizar!");
        else {
          alert(mensaje);
          this.props.navigation.goBack();
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Error de Internet!!");
      });
  }
  Eliminar() {
    fetch(
      "https://guia10-dps-mat.000webhostapp.com/api.php?comando=eliminar&id=" +
        this.state.id,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        const mensaje = responseJson.mensaje;
        console.log(mensaje);
        if (!mensaje) alert("Error al eliminar!");
        else {
          alert(mensaje);
          this.props.navigation.goBack();
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Error de Internet!!");
      });
  }
  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              height: 60,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                height: 40,
                backgroundColor: "black",
                borderRadius: 5,
                justifyContent: "center",
                marginLeft: 5,
              }}
              onPress={() => {
                this.Actualizar();
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 22,
                  textAlign: "center",
                  textAlignVertical: "center",
                  padding: 3,
                }}
              >
                Actualizar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                height: 40,
                backgroundColor: "black",
                borderRadius: 5,
                justifyContent: "center",
                marginLeft: 5,
                marginRight: 5,
              }}
              onPress={() => {
                this.Eliminar();
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 22,
                  textAlign: "center",
                  textAlignVertical: "center",
                  padding: 3,
                }}
              >
                Eliminar
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, padding: 20 }}>
            <NavigationEvents
              onWillFocus={() => {
                // Do your things here
                console.log("Entro aqui" + navigation.getParam("nombre"));
                this.setState({
                  direccion_postal: navigation.getParam("direccion_postal"),
                  direccion_trabajo: navigation.getParam("direccion_trabajo"),
                  email: navigation.getParam("email"),
                  nivel_economico: navigation.getParam("nivel_economico"),
                  nombre: navigation.getParam("nombre"),
                  telefono: navigation.getParam("telefono"),
                  id: navigation.getParam("id"),
                });
              }}
            />
            <Input
              label="Nombre"
              value={this.state.nombre}
              placeholder="Nombre"
              onChangeText={(text) => this.setState({ nombre: text })}
            />
            <Input
              label="Direccion postal"
              value={this.state.direccion_postal}
              inputStyle={{ marginTop: 10 }}
              placeholder="Direccion postal"
              onChangeText={(text) => this.setState({ direccion_postal: text })}
            />
            <Input
              label="Direccion de trabajo"
              value={this.state.direccion_trabajo}
              inputStyle={{ marginTop: 10 }}
              placeholder="Direccion de trabajo"
              onChangeText={(text) => this.setState({ direccion_postal: text })}
            />
            <Input
              label="Correo"
              value={this.state.email}
              inputStyle={{ marginTop: 10 }}
              placeholder="E-mail"
              onChangeText={(text) => this.setState({ email: text })}
            />
            <Input
              label="Nivel economico"
              value={this.state.nivel_economico}
              inputStyle={{ marginTop: 10 }}
              placeholder="Nivel economico"
              onChangeText={(text) => this.setState({ nivel_economico: text })}
            />
            <Input
              label="Telefono"
              value={this.state.telefono}
              inputStyle={{ marginTop: 10 }}
              placeholder="Telefono"
              onChangeText={(text) => this.setState({ telefono: text })}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
class PaginaAgregar extends React.Component {
  state = {
    direccion_postal: "",
    direccion_trabajo: "",
    email: "",
    nivel_economico: "",
    nombre: "",
    telefono: "",
  };
  static navigationOptions = {
    title: "Agregar producto",
    headerStyle: {
      backgroundColor: "#f4511e",
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
    },
  };
  Guardar() {
    fetch(
      "https://guia10-dps-mat.000webhostapp.com/api.php?comando=agregar&direccion_postal=" +
        this.state.direccion_postal +
        "&direccion_trabajo=" +
        this.state.direccion_trabajo +
        "&email=" +
        this.state.email +
        "&nivel_economico=" +
        this.state.nivel_economico +
        "&nombre=" +
        this.state.nombre +
        "&telefono=" +
        this.state.telefono,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        const mensaje = responseJson.mensaje;
        console.log(mensaje);
        if (!mensaje) alert("Error al agregar!");
        else {
          alert(mensaje);
          this.props.navigation.goBack();
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Error de Internet!!");
      });
  }
  render() {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <Input
          placeholder="Nombre"
          onChangeText={(text) => this.setState({ nombre: text })}
        />
        <Input
          inputStyle={{ marginTop: 10 }}
          placeholder="Direccion postal"
          onChangeText={(text) => this.setState({ direccion_postal: text })}
        />
        <Input
          inputStyle={{ marginTop: 10 }}
          placeholder="Direccion de trabajo"
          onChangeText={(text) => this.setState({ direccion_trabajo: text })}
        />
        <Input
          inputStyle={{ marginTop: 10 }}
          placeholder="Correo electronico"
          onChangeText={(text) => this.setState({ email: text })}
        />
        <Input
          inputStyle={{ marginTop: 10 }}
          placeholder="Nivel economico"
          onChangeText={(text) => this.setState({ nivel_economico: text })}
        />
        <Input
          inputStyle={{ marginTop: 10 }}
          placeholder="Telefono"
          onChangeText={(text) => this.setState({ telefono: text })}
        />
        <TouchableOpacity
          style={{
            height: 50,
            backgroundColor: "red",
            marginTop: 15,
            borderRadius: 5,
            justifyContent: "center",
            marginLeft: 20,
            marginRight: 20,
          }}
          onPress={() => {
            this.Guardar();
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 22,
              textAlign: "center",
              textAlignVertical: "center",
            }}
          >
            Guardar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const RootStack = createStackNavigator(
  {
    Inicio: PantallaInicio,
    ListarProductos: listarProductos,
    Detalles: PaginaDetalle,
    Agregar: PaginaAgregar,
  },
  {
    initialRouteName: "Inicio",
  }
);
const AppContainer = createAppContainer(RootStack);
export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
