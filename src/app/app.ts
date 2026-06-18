import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, computed, ElementRef, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

interface TimelineEvent {
  year: string;
  role: string;
  company: string;
  description: string;
  isCurrent: boolean;
  type: string;
}

interface TechCategory{
  name: string;
  items: string[];
}

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  status: 'Activo' | 'Completado';
}

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements AfterViewChecked {

  @ViewChild('consoleContainer') private consoleContainer!: ElementRef;
  selectedTech = signal<string | null>(null);

  // Estado de la consola interactiva
  consoleLogs = signal<string[]>([
    'RDevito OS v2.1.0',
    'Conexión segura establecida.',
    'Escribe "help" para ver los comandos.'
  ]);

  // Lista de tecnologías extraída de tu CV
  techCategories: TechCategory[] = [
    { name: 'Lenguajes', items: ['C#', 'JavaScript', 'TypeScript', 'SQL', 'HTML', 'CSS'] },
    { name: 'Frameworks', items: ['Angular', 'React', 'Ionic', '.NET', 'ABP Framework'] },
    { name: 'Bases de Datos', items: ['PostgreSQL', 'SQL Server'] },
    { name: 'Herramientas & Cloud', items: ['Git', 'GitHub', 'Visual Studio', 'VS Code', 'Linux/Ubuntu', 'AWS'] }
  ];

  // Timeline extraída de tu experiencia (sin nexoFr, enfocado en educación y trabajo formal)
  timeline: TimelineEvent[] = [
    {
      year: '2025 - Actualidad',
      role: 'Desarrollador Full Stack',
      company: 'WBSISTEMAS',
      description: 'Participación en el desarrollo de soluciones web y mobile. Desarrollo de funcionalidades, integración con APIs REST, manejo de bases de datos y mantenimiento de aplicaciones.',
      isCurrent: true,
      type: 'work'
    },
    {
      year: 'En Curso',
      role: 'Tecnicatura Universitaria de Programación',
      company: 'Universidad Tecnológica Nacional (UTN)',
      description: 'Formación académica superior enfocada en lógica de programación, arquitecturas de software y bases de datos.',
      isCurrent: false,
      type: 'education'
    }
  ];

  // Proyectos adaptados a tus datos (sin nexoFr, que ahora tiene su propia sección)
  projects = signal<Project[]>([
    {
      id: 'p1',
      title: 'Sistema de Gestión Web',
      description: 'Desarrollo de plataforma administrativa robusta utilizando ABP Framework para el manejo de entidades y reglas de negocio complejas.',
      tags: ['C#', '.NET', 'ABP Framework', 'SQL Server'],
      category: 'WBSISTEMAS',
      status: 'Activo'
    },
    {
      id: 'p2',
      title: 'Aplicación Mobile Híbrida',
      description: 'Aplicación orientada al usuario final con integración a servicios en la nube y consumo de APIs REST.',
      tags: ['Ionic', 'TypeScript', 'Angular', 'PostgreSQL'],
      category: 'WBSISTEMAS',
      status: 'Activo'
    },
    {
      id: 'p3',
      title: 'Arquitectura Backend & APIs',
      description: 'Creación de servicios y microservicios escalables alojados en la nube para procesamiento de datos.',
      tags: ['C#', '.NET', 'AWS', 'Linux/Ubuntu'],
      category: 'Personal',
      status: 'Completado'
    }
  ]);

  // Computed signal para filtrar la cuadrícula
  filteredProjects = computed(() => {
    let list = this.projects();
    const tech = this.selectedTech();

    if (tech) {
      list = list.filter(p => p.tags.includes(tech));
    }

    return list;
  });

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.consoleContainer.nativeElement.scrollTop = this.consoleContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  toggleTech(tech: string) {
    if (this.selectedTech() === tech) {
      this.selectedTech.set(null);
    } else {
      this.selectedTech.set(tech);
    }
  }

  clearTechFilter() {
    this.selectedTech.set(null);
  }

  // Lógica de la consola interactiva
  executeCommand(event: Event) {
    const input = event.target as HTMLInputElement;
    const cmd = input.value.trim().toLowerCase();

    if (!cmd) return;

    // Agregar comando al log
    this.consoleLogs.update(logs => [...logs, `> ${cmd}`]);

    // Lógica de respuesta
    setTimeout(() => {
      switch (cmd) {
        case 'help':
          this.consoleLogs.update(l => [...l, 'Comandos disponibles:', '  skills  - Lista tecnologías clave', '  cls   - Limpia la consola', '  contact - Muestra correo de contacto', '  nexo    - Abre la web de nexoFr']);
          break;
        case 'cls':
          this.consoleLogs.set([]);
          break;
        case 'skills':
          this.consoleLogs.update(l => [...l, 'Cargando stack...', '.NET, Angular, Ionic, PostgreSQL, AWS']);
          break;
        case 'contact':
          this.consoleLogs.update(l => [...l, 'Enviando ping a Roberto...', 'Email: rodevito2004@gmail.com']);
          break;
        case 'nexo':
          this.consoleLogs.update(l => [...l, 'Redirigiendo a nexofrturnos.online...']);
          window.open('https://nexofrturnos.online/', '_blank');
          break;
        case 'sudo':
          this.consoleLogs.update(l => [...l, 'Error: Permisos insuficientes. Este incidente será reportado.']);
          break;
        default:
          this.consoleLogs.update(l => [...l, `Comando no reconocido: '${cmd}'. Escribe 'help' para ayuda.`]);
      }
    }, 300);

    // Limpiar input
    input.value = '';
  }

}

