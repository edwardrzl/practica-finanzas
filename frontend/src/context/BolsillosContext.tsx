import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { type Bolsillo } from '../types/types'
import { obtenerBolsillos } from '../api/bolsillosClient'
/* Dicen que la respiración lo ayuda a uno en el día a día, por ejemplo hay un ritmo si no me equivoco  4 6 7 para calmarse. Mi duda es hay un ritmo en especial para el día a día? para estar concentrado y similar? O es mejor la que tiene el cuerpo automaticamente? Me preocupa porque dicen que el cerebro necesita oxígeno, y me he fijado que cuando respiro de forma inconciente respiro menos de un segundo y sin intensidad, como que cojo el aire minimo necesario para sobrevivir y no hago mas, no sé si sea lo ideal, entonces escucho tus recomendaciones.
    
    Estos días, o más bien meses, desde la ruptura con mi novia me he comparado mucho con otras personas en cuestión de ingresos, mi ejemplo más cercano es cuando inicie practicas entré con otro compañero, el ya acabó y quedó como empleado acá, mientras yo estoy atrasado casi 4 meses por un accidente de transito y pues todo este tiempo voy a seguir ganando el minimo, también me comparo con gente que sé que es menos inteligente que yo y gana más o ya están en puestos de ingeniería, me comparo con el ex de mi ex (con el que me montaron cacho), los papás de él tienen fabricas de calzado y pues él tiene el último celular, una buena moto y un carro ultimo modelo. Y yo solo gano el mínimo, tengo un patrimonio en efectivo de 6 millones, de los cuales 4 son ahorro, pero no sé ahorros de para qué? no tengo metas proximas, no me voy a comprar un celular ni una moto ni una casa, siento que cuando merezca esos gastos no deberé ahorrar por ellos, y pues he pensado mucho comprarme un celular de 5 millones, pero solo tengo la capacidad de ahorro de 300 mensuales... y pues mi dilema es pues no me sé explicar, no quiero ser consumista, al fin y al cabo si quiero cosas caras, que puedo cubrir la necesidad con algo más economico, pues... pero tampoco quiero durar ganando el minimo toda mi vida, es raro, sé que la felicidad no la da el dinero, tampoco un celular, ni una moto (aunque yo llevo 3 años con mi moto y la amo), es raro... en algun momento querré pareja, pero sé que no estoy preparado con mi sueldo actual, no lo digo porque quiero hacer cosas super caras con ella ni finjir alguien que no soy, sino que a duras penas actualmente no puedo ni conmigo mismo, y pues es un hecho que hoy en día en nuestra sociedad existe la hipergamia, yo no quiero con una persona que no me guste su fisico, y una mujer nestá en su derecho en filtrar su pareja segun los ingresos que tenga. Y pues me siento raro con eso, ahorita vuelvo a tocar el tema de las mujeres. Sabes qué puedo hacer para empezar a generar más? Trabajar en la noche de domiciliario? Invertir mis 4 millones en comprar y revender algo? generar un producto? volverme influencer? o intentar todo y ver en qué me vuelvo bueno? Ya me has dicho un montón que invierta en mi conocimiento, y pues en eso estoy pero no puedo hacer más? siento que tengo mucho tiempo libre, y aprender más de programación después de la jornada de 8 horas creo que no es sano, o qué opinas?
    
    Hay algo que no he comentado  y debe ser a profundidad una de las razones más fuertes para estar apegado a Mayra, soy muy poco sociable, ahorita refuerzo esto, pero en especial con las mujeres, a tal punto nunca he tenido una amiga, no sé cómo tratarlas ni cómo hablarles, asumo que como si fueran hombres, pero aún así mi circulo nunca se ha prestado para tener amigas, en el colegio era demasiado timido, solo tenía 2 amigos que también los eran, deespués del cole entre a estudiar sistemas, cero mujeres, y trabajaba de paso con mi hermano en un taller, cero mujeres, pero en el trabajo aprendí mucho a tratar con las personas ya siendo compañeros o hablando fluidamente con los clientes, antes me daba miedo hacer una orden en un restaurante o pedir un favor, eso se acabó, pero de todas formas en ningun entorno encontraba alguna situación para hacer una relación con una mujer, tipo verla todos los días empezar saludando y luego pidiendo favores, nunca tuve esa oportunidad, y se me hace que es la mejor forma de entablar una amistad, progresivamente, (pj)
    
    soledad luis*/
interface BolsillosContextType {
    bolsillos: Bolsillo[];
    setBolsillos: React.Dispatch<React.SetStateAction<Bolsillo[]>>;
}

const BolsillosContext = createContext<BolsillosContextType | undefined>(undefined)

export function BolsillosProvider({ children }: { children: ReactNode }) {
    const [bolsillos, setBolsillos] = useState<Bolsillo[]>([])

    useEffect(() => {
        obtenerBolsillos().then(setBolsillos)
    }, [])

    return (
        <BolsillosContext.Provider value={{ bolsillos, setBolsillos }}>
            {children}
        </BolsillosContext.Provider>
    )
    
}

export function useBolsillos() {
    const context = useContext(BolsillosContext)
    if (!context) {
        throw new Error('useBolsillos debe usarse dentro de un BolsillosProvider')
    }
    return context
}