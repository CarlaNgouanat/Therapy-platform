import { AbstractDB } from '@database/db/AbstractDB';
import { PatientInterestModel } from '@shared/models/PatientInterestModel';
import { PatientInterestMapper } from '@database/mappers/PatientInterestMapper';
import { PatientInterestTable } from '@database/tables/PatientInterestTable';
import { AbstractMapper } from '@database/mappers/AbstractMapper';

/**
 * Class PatientInterestDB
 * Cette classe interagit avec la base de données
 */
export class PatientInterestDB extends AbstractDB<
  PatientInterestTable,
  PatientInterestModel
> {
  // Définition du mapper
  protected mapper: new () => AbstractMapper<
    PatientInterestTable,
    PatientInterestModel
  > = PatientInterestMapper;
}
