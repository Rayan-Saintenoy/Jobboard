import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateAdvertisementsDto {
  @ApiProperty({
    example: 'Développeur fullstack H/F',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example:
      "Nous recherchons un développeur fullstack talentueux et passionné pour rejoindre notre équipe dynamique. Vous serez responsable de la conception, du développement et de la maintenance d'applications web innovantes.\nMissions :\n- Développement Frontend : Concevoir et développer des interfaces utilisateur interactives avec HTML, CSS et JavaScript, en utilisant des frameworks modernes (React, Vue.js, etc.).\n- Développement Backend : Créer et maintenir la logique serveur, gérer les bases de données et développer des API avec des langages tels que Node.js, Python ou Java.\n- Intégration et Déploiement : Assurer l'intégration harmonieuse entre le frontend et le backend, tester les applications et déployer des mises à jour régulières.\n- Collaboration : Travailler en étroite collaboration avec les designers, chefs de projet et autres développeurs pour garantir la cohérence et l'efficacité des projets.\n- Résolution de Problèmes : Diagnostiquer et résoudre les bugs et problèmes de performance pour offrir une expérience utilisateur optimale.",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: '3590',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  salary: number;

  @ApiProperty({
    example: 'Lille',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  place: string;

  @ApiProperty({
    example: '35',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  working_time: number;

  @ApiProperty({
    example: ['NextJs', 'NestJs', 'ReactJs', 'TailwindCSS'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  skills: string[];
}
