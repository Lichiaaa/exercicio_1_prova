

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

//    Instanciando as classes 

//Carros
let v1: Veiculo = new Carro('ABC-1234', TipoVeiculo.Car);
let v2: Veiculo = new Carro('QWE-9J87', TipoVeiculo.Car);
let v3: Veiculo = new Carro('MNO-4567', TipoVeiculo.Car);
//Motos
let v4: Veiculo = new Moto('XYZ-9988', TipoVeiculo.Motorcycle);
let v5: Veiculo = new Moto('KLM-7A21', TipoVeiculo.Motorcycle);
let v6: Veiculo = new Moto('RTY-3344', TipoVeiculo.Motorcycle);
//Caminhoes
let v7: Veiculo = new Caminhao('TRK-1020', TipoVeiculo.Truck);
let v8: Veiculo = new Caminhao('CMT-8899', TipoVeiculo.Truck);
let v9: Veiculo = new Caminhao('LNG-5566', TipoVeiculo.Truck);

//Estrategias de preco
let estrategia1 = new FlatRatePricing();
let estrategia2 = new ProgressivePricing(2, 1.5);
let estrategia3 = new OvernightPricing(6, 2);

//Criando array de vagas (vazias)
let vaga1 = new Local_Vaga('A1', TipoVeiculo.Car);
let vaga2 = new Local_Vaga('A2', TipoVeiculo.Car);
let vaga3 = new Local_Vaga('A3', TipoVeiculo.Car);
let vaga4 = new Local_Vaga('M1', TipoVeiculo.Motorcycle);
let vaga5 = new Local_Vaga('M2', TipoVeiculo.Motorcycle);
let vaga6 = new Local_Vaga('M3', TipoVeiculo.Motorcycle);
let vaga7 = new Local_Vaga('Z1', TipoVeiculo.Truck);
let vaga8 = new Local_Vaga('Z2', TipoVeiculo.Truck);
let vaga9 = new Local_Vaga('Z3', TipoVeiculo.Truck);
let vaga10 = new Local_Vaga('A4', TipoVeiculo.Car);

let l = new Lista_Vagas;
l.addSpot(vaga1);
l.addSpot(vaga2);
l.addSpot(vaga3);
l.addSpot(vaga4);
l.addSpot(vaga5);
l.addSpot(vaga6);
l.addSpot(vaga7);
l.addSpot(vaga8);
l.addSpot(vaga9);
l.addSpot(vaga10);

// Resposta vai ser true (verdadeira) pq todas as vagas começam vazias
console.log("A1 livre?", vaga1.isFree());
console.log("M1 livre?", vaga4.isFree());
console.log("Z3 livre?", vaga9.isFree());

//Estacionando alguns veiculos
console.log("(v1) Estaciona em uma vaga");
let vagaOcupada1 = l.park(v1);
console.log("Estacionou em:", vagaOcupada1?.getId());
console.log("A1 livre?", vaga1.isFree());
console.log("Veículo em A1:", vaga1.getVeiculo()?.getPlaca());

console.log("(v5) Estaciona em uma vaga");
let vagaOcupada2 = l.park(v5);
console.log("Estacionou em:", vagaOcupada2?.getId());
console.log("M1 livre?", vaga4.isFree());
console.log("Veículo em M1:", vaga4.getVeiculo()?.getPlaca());

console.log("(v8) Estaciona em uma vaga");
let vagaOcupada3 = l.park(v8);
console.log("Estacionou em:", vagaOcupada3?.getId());
console.log("Z1 livre?", vaga7.isFree());
console.log("Veículo em Z1:", vaga7.getVeiculo()?.getPlaca());

//Teste para veiculos incompativel com a vaga
let teste = vaga2.park(v4);
console.log("Moto conseguiu estacionar na vaga de carro? ", teste);

//Cobranças
console.log("[v5 | Moto] Cobrança para Flat Rating Price: ", l.calculateFee(v4, 3, estrategia1));
console.log("[v8 | Caminhao] Cobrança para Progressive Pricing", l.calculateFee(v8, 10, estrategia2));
console.log("[v1 | Carro] Cobrança para Overnight Pricing", l.calculateFee(v1, 21, estrategia3));

//Saida de um Carro
let vagaDesocupada = l.leaveFromSpot('A1');
console.log("Placa do Carro:", vagaDesocupada?.getPlaca());
console.log("A1 livre depois?", vaga1.isFree());