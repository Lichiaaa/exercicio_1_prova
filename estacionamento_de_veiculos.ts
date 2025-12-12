

enum TipoVeiculo {
    Car = 'Carro',
    Motorcycle = 'Moto',
    Truck = 'Caminhao'
}

interface Estrategia_Preco {
    calcule(veiculo: Veiculo, horas: number): number;
}

class FlatRatePricing implements Estrategia_Preco{
    //cobra horas arredondadas × preço base
    constructor(
        private basePricePerHour: number
    ) {}

    calcule(v: Veiculo, h: number): number {
        const horasArredondadas = Math.ceil(h);
        return horasArredondadas * v.getBasePricePerHour();
    }
}

class ProgressivePricing implements Estrategia_Preco{
    //primeiras N horas preço normal, depois fator maior
    constructor(
        private tempo_base: number,
        private multiplicador: number
    ){}

    calcule(v: Veiculo, h: number): number {
        const horasT = Math.ceil(h);
        const base = v.getBasePricePerHour();

        const normal = Math.min(horasT, this.tempo_base);
        const extra = Math.max(0, (horasT - this.tempo_base));

        return ((normal*base) + (extra*base*this.multiplicador));
    }
}

class OvernightPricing implements Estrategia_Preco{
    //acima de certo número de horas, aplica tarifa noturna especial
    constructor(
        private limiteHoras: number,      // a partir de quantas horas vira “noturno”
        private multiplicadorNoturno: number // ex: 1.8, 2.0
    ) {}

    calcule(v: Veiculo, h: number): number {
        const horasT = Math.ceil(h);
        const base = v.getBasePricePerHour();

        const normal = Math.min(horasT, this.limiteHoras);
        const noturno = Math.max(0, horasT - this.limiteHoras);

        return (normal * base) + (noturno * base * this.multiplicadorNoturno);
    }
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

    setPlaca(p: string): void {
        this.placa = p;
    }
    
    getTipo(): TipoVeiculo {
        return this.tipo;
    }

    setTipo(t: TipoVeiculo): void {
        this.tipo = t;
    }

    abstract getBasePricePerHour(): number;
}

class Carro extends Veiculo {
    getBasePricePerHour(): number {
        return 6;
    }
}

class Moto extends Veiculo {
    getBasePricePerHour(): number {
        return 3;
    }
}

class Caminhao extends Veiculo {
    getBasePricePerHour(): number {
        return 15;
    }
}

class Local_Vaga{
    private id: string;
    private tipoPermitido: TipoVeiculo;
    private veiculo?: Veiculo | null;

    constructor(id: string, tipoPermitido: TipoVeiculo, veiculo: Veiculo | null = null){
        this.id = id;
        this.tipoPermitido = tipoPermitido;
        this.veiculo = veiculo;
    }

    getId(): string {
        return this.id;
    }

    setId(id: string): void {
        this.id = id;
    }

    getTipoPermitido(): TipoVeiculo {
        return this.tipoPermitido;
    }

    setTipoPermitido(tp: TipoVeiculo): void{
        this.tipoPermitido = tp;
    }

    getVeiculo(): Veiculo | null | undefined{
        return this.veiculo;
    }

    setVeiculo(v: Veiculo | null): void {
        if (v != null && v.getTipo() !== this.tipoPermitido){
            throw new Error ('[ERRO] Tipo de veiculo incompativel com a vaga!');
        }
        this.veiculo = v;
    }

    isFree(): boolean {
        if (this.veiculo == null){
            return true;
        }
        else {
            return false;
        }
    }

    park(veiculo: Veiculo): boolean {
        //só estaciona se estiver livre e vehicle.type === allowedType
        if (this.isFree() && veiculo.getTipo() === this.getTipoPermitido()) {
            this.veiculo = veiculo;
            return true; //Estaciona
        }
        return false; //Nao estaciona
    }

    leave(): Veiculo | null {
        if (this.isFree() === true){
            return null; //Não tem veiculo na vaga
        }
        else {
            const RemoverVeiculo: Veiculo = this.veiculo as Veiculo;
            this.setVeiculo(null);
            return RemoverVeiculo;
        }
    }
}

class Lista_Vagas{
    private l_vagas: Local_Vaga[] = [];

    addSpot(vaga: Local_Vaga): void{
        this.l_vagas.push(vaga);
    }

    findFreeSpotFor(v: Veiculo): Local_Vaga | undefined {
        for(const vaga of this.l_vagas){
            if (vaga.isFree() && vaga.getTipoPermitido() === v.getTipo()){
                return vaga;
            }
        }
        return undefined;
    }

    park(v: Veiculo): Local_Vaga | undefined {
        const vaga_livre = this.findFreeSpotFor(v);
        if (vaga_livre === undefined){
            return undefined;
        }
        else{
            vaga_livre.park(v);
            return vaga_livre;
        }
    }

    leaveFromSpot(id: string): Veiculo | null {
        for(const vaga of this.l_vagas){
            if (vaga.getId() === id){
                return vaga.leave();
            }
        }
        return null;
    }

    calculateFee(v: Veiculo, h: number, e: Estrategia_Preco): number {
        return e.calcule(v,h);
    }
}

