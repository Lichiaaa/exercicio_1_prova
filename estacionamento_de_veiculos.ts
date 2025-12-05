enum TipoVeiculo {
    Car = 'Carro',
    Motorcycle = 'Moto',
    Truck = 'Caminhao'
}

interface Estrategia_Preco{
    calcule(veiculo: Veiculo, horas_totais: number): number;
}

abstract class Veiculo{
    private placa: string;
    private tipo: TipoVeiculo;

    constructor(placa: string, tipo: TipoVeiculo) {
        this.placa = placa;
        this.tipo = tipo;
    }

    getPlaca(): string {
        return this.placa;
    }
    
    getTipo(): TipoVeiculo {
        return this.tipo;
    }

    getBasePricePerHour(hora_inicio: number, hora_final: number): number {
        
    }
}

class Local_Vaga{
    private id: number;
    private allowedType: TipoVeiculo;

    constructor(id: number, allowedType: TipoVeiculo){
        this.id = id;
        this.allowedType = allowedType;
    }

    getId(): number {
        return this.id;
    }

    getAllowedType(): TipoVeiculo {
        return this.allowedType;
    }

    isFree(): boolean {

    }

    park(vehicle: Veiculo): boolean {
        //só estaciona se estiver livre e vehicle.type === allowedType
    }

    leave(): Veiculo | null {

    }
}

class Lista_Vagas{
    private l_vagas: Veiculo[] = [];

    addSpot(vaga: Local_Vaga): void{

    }

    findFreeSpotFor(v: Veiculo): Local_Vaga | undefined {

    }

    park(v: Veiculo): Local_Vaga | undefined {

    }

    leaveFromSpot(id: string): Veiculo | null {

    }

    calculateFee(v: Veiculo, h: number, e: Estrategia_Preco): number {

    }
}

function FlatRatePricing(): {
    //cobra horas arredondadas × preço base
}
function ProgressivePricing(): {
    //primeiras N horas preço normal, depois fator maior
}
function OvernightPricing(): {
    //acima de certo número de horas, aplica tarifa noturna especial
}