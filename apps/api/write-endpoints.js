const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "src", "modules");

const templates = {
  projects: {
    controller: `
import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ConstructionProjectsService } from './construction-projects.service';

@Controller('api/v1/construction/projects')
export class ConstructionProjectsController {
  constructor(private readonly service: ConstructionProjectsService) {}

  @Post()
  create(@Body() data: any) { return this.service.create(data); }

  @Get()
  findAll(@Query('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) { return this.service.update(id, data); }

  @Post(':id/phases')
  addPhase(@Param('id') id: string, @Body() data: any) { return this.service.addPhase(id, data); }

  @Post(':id/milestones')
  addMilestone(@Param('id') id: string, @Body() data: any) { return this.service.addMilestone(id, data); }
}
    `,
    service: `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ConstructionProjectsService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.constructionProject.create({ data });
  }

  findAll(tenantId: string) {
    return this.prisma.constructionProject.findMany({
      where: tenantId ? { tenantId } : undefined,
      include: { phases: true, milestones: true, issues: true }
    });
  }

  findOne(id: string) {
    return this.prisma.constructionProject.findUnique({
      where: { id },
      include: { phases: true, milestones: true, issues: true, boqItems: true, siteActivities: true }
    });
  }

  update(id: string, data: any) {
    return this.prisma.constructionProject.update({ where: { id }, data });
  }

  addPhase(projectId: string, data: any) {
    return this.prisma.constructionPhase.create({ data: { ...data, projectId } });
  }

  addMilestone(projectId: string, data: any) {
    return this.prisma.constructionMilestone.create({ data: { ...data, projectId } });
  }
}
    `,
  },
  boq: {
    controller: `
import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { ConstructionBoqService } from './construction-boq.service';

@Controller('api/v1/construction/boq')
export class ConstructionBoqController {
  constructor(private readonly service: ConstructionBoqService) {}

  @Post()
  create(@Body() data: any) { return this.service.create(data); }

  @Get()
  findAll(@Query('projectId') projectId: string) { return this.service.findAll(projectId); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) { return this.service.update(id, data); }
}
    `,
    service: `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ConstructionBoqService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.constructionBOQItem.create({ data });
  }

  findAll(projectId: string) {
    return this.prisma.constructionBOQItem.findMany({
      where: projectId ? { projectId } : undefined,
      include: { consumptions: true }
    });
  }

  findOne(id: string) {
    return this.prisma.constructionBOQItem.findUnique({
      where: { id },
      include: { consumptions: true }
    });
  }

  update(id: string, data: any) {
    return this.prisma.constructionBOQItem.update({ where: { id }, data });
  }
}
    `,
  },
  site: {
    controller: `
import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { ConstructionSiteOperationsService } from './construction-site-operations.service';

@Controller('api/v1/construction/site-operations')
export class ConstructionSiteOperationsController {
  constructor(private readonly service: ConstructionSiteOperationsService) {}

  @Post('activities')
  createActivity(@Body() data: any) { return this.service.createActivity(data); }

  @Get('activities')
  getActivities(@Query('projectId') projectId: string) { return this.service.getActivities(projectId); }

  @Post('consumption')
  logConsumption(@Body() data: any) { return this.service.logConsumption(data); }

  @Get('consumption')
  getConsumption(@Query('projectId') projectId: string) { return this.service.getConsumption(projectId); }

  @Post('issues')
  createIssue(@Body() data: any) { return this.service.createIssue(data); }

  @Get('issues')
  getIssues(@Query('projectId') projectId: string) { return this.service.getIssues(projectId); }
}
    `,
    service: `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ConstructionSiteOperationsService {
  constructor(private prisma: PrismaService) {}

  createActivity(data: any) {
    return this.prisma.constructionSiteActivity.create({ data });
  }

  getActivities(projectId: string) {
    return this.prisma.constructionSiteActivity.findMany({ where: projectId ? { projectId } : undefined, orderBy: { createdAt: 'desc' } });
  }

  logConsumption(data: any) {
    return this.prisma.constructionMaterialConsumption.create({ data });
  }

  getConsumption(projectId: string) {
    return this.prisma.constructionMaterialConsumption.findMany({ where: projectId ? { projectId } : undefined, orderBy: { createdAt: 'desc' } });
  }

  createIssue(data: any) {
    return this.prisma.constructionProjectIssue.create({ data });
  }

  getIssues(projectId: string) {
    return this.prisma.constructionProjectIssue.findMany({ where: projectId ? { projectId } : undefined, orderBy: { createdAt: 'desc' } });
  }
}
    `,
  },
  labor: {
    controller: `
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ConstructionLaborService } from './construction-labor.service';

@Controller('api/v1/construction/labor')
export class ConstructionLaborController {
  constructor(private readonly service: ConstructionLaborService) {}

  @Post('attendance')
  logAttendance(@Body() data: any) { return this.service.logAttendance(data); }

  @Get('attendance')
  getAttendance(@Query('projectId') projectId: string) { return this.service.getAttendance(projectId); }

  @Get('productivity')
  getProductivity(@Query('projectId') projectId: string) { return this.service.getProductivity(projectId); }
}
    `,
    service: `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ConstructionLaborService {
  constructor(private prisma: PrismaService) {}

  logAttendance(data: any) {
    return this.prisma.constructionLaborAttendance.create({ data });
  }

  getAttendance(projectId: string) {
    return this.prisma.constructionLaborAttendance.findMany({ where: projectId ? { projectId } : undefined, orderBy: { date: 'desc' } });
  }

  async getProductivity(projectId: string) {
    const attendance = await this.prisma.constructionLaborAttendance.findMany({ where: projectId ? { projectId } : undefined });
    const totalHours = attendance.reduce((sum, a) => sum + a.hoursWorked + a.overtimeHours, 0);
    const totalCost = attendance.reduce((sum, a) => sum + a.totalCalculatedWage, 0);
    return { totalHours, totalCost, records: attendance.length };
  }
}
    `,
  },
  equipment: {
    controller: `
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ConstructionEquipmentService } from './construction-equipment.service';

@Controller('api/v1/construction/equipment')
export class ConstructionEquipmentController {
  constructor(private readonly service: ConstructionEquipmentService) {}

  @Post('assignments')
  assignEquipment(@Body() data: any) { return this.service.assignEquipment(data); }

  @Get('assignments')
  getAssignments(@Query('projectId') projectId: string) { return this.service.getAssignments(projectId); }
}
    `,
    service: `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ConstructionEquipmentService {
  constructor(private prisma: PrismaService) {}

  assignEquipment(data: any) {
    return this.prisma.constructionEquipmentAssignment.create({ data });
  }

  getAssignments(projectId: string) {
    return this.prisma.constructionEquipmentAssignment.findMany({ where: projectId ? { projectId } : undefined, orderBy: { assignmentDate: 'desc' } });
  }
}
    `,
  },
};

fs.writeFileSync(
  path.join(srcDir, "construction-projects", "construction-projects.controller.ts"),
  templates.projects.controller,
);
fs.writeFileSync(
  path.join(srcDir, "construction-projects", "construction-projects.service.ts"),
  templates.projects.service,
);

fs.writeFileSync(
  path.join(srcDir, "construction-boq", "construction-boq.controller.ts"),
  templates.boq.controller,
);
fs.writeFileSync(
  path.join(srcDir, "construction-boq", "construction-boq.service.ts"),
  templates.boq.service,
);

fs.writeFileSync(
  path.join(srcDir, "construction-site-operations", "construction-site-operations.controller.ts"),
  templates.site.controller,
);
fs.writeFileSync(
  path.join(srcDir, "construction-site-operations", "construction-site-operations.service.ts"),
  templates.site.service,
);

fs.writeFileSync(
  path.join(srcDir, "construction-labor", "construction-labor.controller.ts"),
  templates.labor.controller,
);
fs.writeFileSync(
  path.join(srcDir, "construction-labor", "construction-labor.service.ts"),
  templates.labor.service,
);

fs.writeFileSync(
  path.join(srcDir, "construction-equipment", "construction-equipment.controller.ts"),
  templates.equipment.controller,
);
fs.writeFileSync(
  path.join(srcDir, "construction-equipment", "construction-equipment.service.ts"),
  templates.equipment.service,
);

console.log("Backend endpoints written");
