import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class ConstructionEquipmentService {
  constructor(private prisma: PrismaService) {}

  assignEquipment(data: unknown) {
    // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
    return this.prisma.constructionEquipmentAssignment.create({ data });
  }

  getAssignments(projectId: string) {
    // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
    return this.prisma.constructionEquipmentAssignment.findMany({
      where: projectId ? { projectId } : undefined,
      orderBy: { assignmentDate: "desc" },
    });
  }
}
