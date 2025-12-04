enum TipoVeiculo {
    Car = 'Carro',
    Motorcycle = 'Moto',
    Truck = 'Caminhao'
}

interface Preco{
    calcule(veiculo: Veiculo, horas_totais: number): number;
}

abstract class Veiculo implements Preco{
    private placa: string;
    private tipo: TipoVeiculo;

    constructor(placa: string, tipo: TipoVeiculo) {
        this.placa = placa;
        this.tipo = tipo;
    }
    
    calcule(veiculo: Veiculo, horas_totais: number): number {
        let preco_base = this.getBasePricePerHour(0, horas_totais);
    }

    getBasePricePerHour(hora_inicio: number, hora_final: number): number {
        
    }
}