import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../models/producto';
import { ModalDialogService } from '../../services/modal-dialog.service';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  Titulo = 'Productos';
  TituloAccionABMC = {
    A: '(Agregar)',
    L: '(Listado)'
  };
  AccionABMC = 'L'; // inicialmente inicia en el listado de articulos
  Mensajes = {
    SD: ' No se encontraron registros...',
    RD: ' Revisar los datos ingresados...'
  };

  Items: Producto[] = null;
  submitted: boolean = false;

  FormRegistro: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private productosService: ProductosService,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() {
    this.FormRegistro = this.formBuilder.group({
      ProductoID: [null],
      ProductoNombre: [
        null,
        [Validators.required, Validators.minLength(4), Validators.maxLength(50)] // validador de minLength no especificado, se define 4 arbitrariamente
      ],
      ProductoFechaAlta: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
          )
        ]
      ],
      ProductoStock: [
        null,
        [Validators.required, Validators.pattern('^\\d{1,10}$')] // validador de pattern opcional, pero es más realista
      ]
    });
    this.Buscar();
  }

  Alta() {
    this.AccionABMC = 'A';
    this.FormRegistro.reset({ IdArticulo: 0 });
    this.submitted = false;
    this.FormRegistro.markAsUntouched();
  }

  // Buscar todos los productos listados
  Buscar() {
    this.productosService.get().subscribe((res: any) => {
      this.Items = res;
    });
  }

  // Aceptar altas de productos
  Aceptar() {
    this.submitted = true;
    if (this.FormRegistro.invalid) {
      return;
    }

    this.FormRegistro.value.ProductoID = '0';

    if (this.AccionABMC == 'A') {
      this.productosService
        .post(this.FormRegistro.value)
        .subscribe((res: any) => {
          this.Volver();
          this.modalDialogService.Alert('Producto agregado correctamente.');
          this.Buscar();
        });
    }
  }

  // Volver desde Alta de producto
  Volver() {
    this.AccionABMC = 'L';
  }
}
