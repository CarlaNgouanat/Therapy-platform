import { describe, it, expect } from 'vitest';
import { ExerciseInterestMapper } from '@database/mappers/ExerciseInterestMapper';
import { ExerciseMapper } from '@database/mappers/ExerciseMapper';
import { InterestMapper } from '@database/mappers/InterestMapper';
import { PatientInterestMapper } from '@database/mappers/PatientInterestMapper';
import { PatientMapper } from '@database/mappers/PatientMapper';
import { ResourceMapper } from '@database/mappers/ResourceMapper';
import { SessionExerciseMapper } from '@database/mappers/SessionExerciseMapper';
import { SessionMapper } from '@database/mappers/SessionMapper';
import { ExerciseInterestTable } from '@database/tables/ExerciseInterestTable';
import { ExerciseTable } from '@database/tables/ExerciseTable';
import { InterestTable } from '@database/tables/InterestTable';
import { PatientInterestTable } from '@database/tables/PatientInterestTable';
import { PatientTable } from '@database/tables/PatientTable';
import { ResourceTable } from '@database/tables/ResourceTable';
import { SessionExerciseTable } from '@database/tables/SessionExerciseTable';
import { SessionTable } from '@database/tables/SessionTable';
import { ExerciseInterestModel } from '@shared/models/ExerciseInterestModel';
import { ExerciseModel } from '@shared/models/ExerciseModel';
import { InterestModel } from '@shared/models/InterestModel';
import { PatientInterestModel } from '@shared/models/PatientInterestModel';
import { PatientModel } from '@shared/models/PatientModel';
import { ResourceModel } from '@shared/models/ResourceModel';
import { SessionExerciseModel } from '@shared/models/SessionExerciseModel';
import { SessionModel } from '@shared/models/SessionModel';
import { SFAExerciseModel } from '@shared/models/exercises/SFAExerciseModel';
import { DateMapper } from '@database/mappers/date/DateMapper';
import { SFAExerciseMapper } from '@database/mappers/exercises/SFAExerciseMapper';
import { PCAExerciseModel } from '@shared/models/exercises/PCAExerciseModel';
import { OtherExerciseModel } from '@shared/models/exercises/OtherExerciseModel';
import { PCAExerciseMapper } from '@database/mappers/exercises/PCAExerciseMapper';
import { OtherExerciseMapper } from '@database/mappers/exercises/OtherExerciseMapper';

// Test du mapper de Date
describe('dateMapper', () => {
  // Liste des données à tester
  const dateStr: string = '2024-01-01 01:02:03';
  const date: Date = new Date(2024, 0, 1, 1, 2, 3);

  const dateStr2: string = '2024-12-31 23:59:59';
  const date2: Date = new Date(2024, 11, 31, 23, 59, 59);
  const dateMapper: DateMapper = new DateMapper();

  // Test de la fonction de mapping string -> date
  it('> stringToDate', () => {
    expect(date).toStrictEqual(dateMapper.stringToDate(dateStr));
    expect(date2).toStrictEqual(dateMapper.stringToDate(dateStr2));
  });

  // Test de la fonction de mapping date -> string
  it('> dateToString', () => {
    expect(dateStr).toStrictEqual(dateMapper.dateToString(date));
    expect(dateStr2).toStrictEqual(dateMapper.dateToString(date2));
  });

  // Test de la fonction de mapping string -> date -> string
  it('> stringToDate > dateToString', () => {
    expect(dateStr).toStrictEqual(
      dateMapper.dateToString(dateMapper.stringToDate(dateStr))
    );
    expect(dateStr2).toStrictEqual(
      dateMapper.dateToString(dateMapper.stringToDate(dateStr2))
    );
  });
});

// Test du mapper ExerciseInterestMapper
describe('ExerciseInterestMapper', () => {
  // Liste des données à tester
  const exerciseInterestTable: ExerciseInterestTable = {
    exercise_id: 4,
    interest_id: 5,
  };
  const exerciseInterestModel: ExerciseInterestModel = {
    exerciseId: 4,
    interestId: 5,
  };
  const exerciseInterestMapper: ExerciseInterestMapper =
    new ExerciseInterestMapper();

  // Test de la fonction de mapping table -> model
  it('> mapTableToModel', () => {
    expect(exerciseInterestModel).toStrictEqual(
      exerciseInterestMapper.mapTableToModel(exerciseInterestTable)
    );
  });

  // Test de la fonction de mapping model -> table
  it('> mapModelToTable', () => {
    expect(exerciseInterestTable).toStrictEqual(
      exerciseInterestMapper.mapModelToTable(exerciseInterestModel)
    );
  });

  // Test de la fonction de mapping table -> model -> table
  it('> mapTableToModel > mapModelToTable', () => {
    expect(exerciseInterestTable).toStrictEqual(
      exerciseInterestMapper.mapModelToTable(
        exerciseInterestMapper.mapTableToModel(exerciseInterestTable)
      )
    );
  });
});

// Tests des mappers des exercices
describe('ExecisesMapper', () => {
  // Liste des données à tester
  const sfaExerciseModel: SFAExerciseModel = {
    sfaCategory: 'category',
    sfaUse: 'use',
    sfaAction: 'action',
    sfaProperties: 'properties',
    sfaAssociation: 'association',
  };
  const pcaExerciseModel: PCAExerciseModel = {};
  const otherExerciseModel: OtherExerciseModel = {};

  const sfaExerciseStr: string =
    '{"sfaCategory":"category","sfaUse":"use","sfaAction":"action","sfaProperties":"properties","sfaAssociation":"association"}';
  const pcaExerciseStr: string = '{}';
  const otherExerciseStr: string = '{}';

  const sfaExerciseMapper: SFAExerciseMapper = new SFAExerciseMapper();
  const pcaExerciseMapper: PCAExerciseMapper = new PCAExerciseMapper();
  const otherExerciseMapper: OtherExerciseMapper = new OtherExerciseMapper();

  // Test de la fonction de mapping json -> model
  it('> mapJsonStrToModel', () => {
    expect(sfaExerciseModel).toStrictEqual(
      sfaExerciseMapper.mapJsonStrToModel(sfaExerciseStr)
    );
    expect(pcaExerciseModel).toStrictEqual(
      pcaExerciseMapper.mapJsonStrToModel(pcaExerciseStr)
    );
    expect(otherExerciseModel).toStrictEqual(
      otherExerciseMapper.mapJsonStrToModel(otherExerciseStr)
    );
  });

  // Test de la fonction de mapping model -> json
  it('> mapModelToJsonStr', () => {
    expect(sfaExerciseStr).toStrictEqual(
      sfaExerciseMapper.mapModelToJsonStr(sfaExerciseModel)
    );
    expect(pcaExerciseStr).toStrictEqual(
      pcaExerciseMapper.mapModelToJsonStr(pcaExerciseModel)
    );
    expect(otherExerciseStr).toStrictEqual(
      otherExerciseMapper.mapModelToJsonStr(otherExerciseModel)
    );
  });

  // Test de la fonction de mapping json -> model -> json
  it('> mapJsonStrToModel > mapModelToJsonStr', () => {
    expect(sfaExerciseStr).toStrictEqual(
      sfaExerciseMapper.mapModelToJsonStr(
        sfaExerciseMapper.mapJsonStrToModel(sfaExerciseStr)
      )
    );
    expect(pcaExerciseStr).toStrictEqual(
      pcaExerciseMapper.mapModelToJsonStr(
        pcaExerciseMapper.mapJsonStrToModel(pcaExerciseStr)
      )
    );
    expect(otherExerciseStr).toStrictEqual(
      otherExerciseMapper.mapModelToJsonStr(
        otherExerciseMapper.mapJsonStrToModel(otherExerciseStr)
      )
    );
  });
});

// Test du mapper ExerciseMapper
describe('ExerciseMapper', () => {
  // Liste des données à tester
  const exerciseTable1: ExerciseTable = {
    id: 1,
    name: 'Test Exercise',
    model: 'SFA',
    patient_id: 10,
    created_at: '2024-01-01 15:25:45',
    data: '{"sfaCategory":"category","sfaUse":"use","sfaAction":"action","sfaProperties":"properties","sfaAssociation":"association"}',
  };
  const exerciseTable2: ExerciseTable = {
    id: 1,
    name: 'Test Exercise',
    model: 'PCA',
    patient_id: 10,
    created_at: '2024-01-01 15:25:45',
    data: '{}',
  };
  const exerciseTable3: ExerciseTable = {
    id: 1,
    name: 'Test Exercise',
    model: 'OTHER',
    patient_id: 10,
    created_at: '2024-01-01 15:25:45',
    data: '{}',
  };
  const exerciseModel1: ExerciseModel = {
    id: 1,
    name: 'Test Exercise',
    model: 'SFA',
    patientId: 10,
    createdAt: new Date(2024, 0, 1, 15, 25, 45),
    data: <SFAExerciseModel>{
      sfaCategory: 'category',
      sfaUse: 'use',
      sfaAction: 'action',
      sfaProperties: 'properties',
      sfaAssociation: 'association',
    },
  };
  const exerciseModel2: ExerciseModel = {
    id: 1,
    name: 'Test Exercise',
    model: 'PCA',
    patientId: 10,
    createdAt: new Date(2024, 0, 1, 15, 25, 45),
    data: <PCAExerciseModel>{},
  };
  const exerciseModel3: ExerciseModel = {
    id: 1,
    name: 'Test Exercise',
    model: 'OTHER',
    patientId: 10,
    createdAt: new Date(2024, 0, 1, 15, 25, 45),
    data: <OtherExerciseModel>{},
  };
  const exerciseMapper = new ExerciseMapper();

  // Test de la fonction de mapping table -> model
  it('> mapTableToModel', () => {
    expect(exerciseMapper.mapTableToModel(exerciseTable1)).toStrictEqual(
      exerciseModel1
    );
    expect(exerciseMapper.mapTableToModel(exerciseTable2)).toStrictEqual(
      exerciseModel2
    );
    expect(exerciseMapper.mapTableToModel(exerciseTable3)).toStrictEqual(
      exerciseModel3
    );
  });

  // Test de la fonction de mapping model -> table
  it('> mapModelToTable', () => {
    expect(exerciseMapper.mapModelToTable(exerciseModel1)).toStrictEqual(
      exerciseTable1
    );
    expect(exerciseMapper.mapModelToTable(exerciseModel2)).toStrictEqual(
      exerciseTable2
    );
    expect(exerciseMapper.mapModelToTable(exerciseModel3)).toStrictEqual(
      exerciseTable3
    );
  });

  // Test de la fonction de mapping table -> model -> table
  it('> mapTableToModel > mapModelToTable', () => {
    expect(exerciseTable1).toStrictEqual(
      exerciseMapper.mapModelToTable(
        exerciseMapper.mapTableToModel(exerciseTable1)
      )
    );
    expect(exerciseTable2).toStrictEqual(
      exerciseMapper.mapModelToTable(
        exerciseMapper.mapTableToModel(exerciseTable2)
      )
    );
    expect(exerciseTable3).toStrictEqual(
      exerciseMapper.mapModelToTable(
        exerciseMapper.mapTableToModel(exerciseTable3)
      )
    );
  });
});

// Test du mapper InterestMapper
describe('InterestMapper', () => {
  // Liste des données à tester
  const interestTable: InterestTable = {
    id: 2,
    name: 'Music',
    created_at: '2024-01-01 15:25:45',
  };
  const interestModel: InterestModel = {
    id: 2,
    name: 'Music',
    createdAt: new Date(2024, 0, 1, 15, 25, 45),
  };
  const interestMapper = new InterestMapper();

  // Test de la fonction de mapping table -> model
  it('> mapTableToModel', () => {
    expect(interestMapper.mapTableToModel(interestTable)).toStrictEqual(
      interestModel
    );
  });

  // Test de la fonction de mapping model -> table
  it('> mapModelToTable', () => {
    expect(interestMapper.mapModelToTable(interestModel)).toStrictEqual(
      interestTable
    );
  });

  // Test de la fonction de mapping table -> model -> table
  it('> mapTableToModel > mapModelToTable', () => {
    expect(interestTable).toStrictEqual(
      interestMapper.mapModelToTable(
        interestMapper.mapTableToModel(interestTable)
      )
    );
  });
});

// Test du mapper PatientInterestMapper
describe('PatientInterestMapper', () => {
  // Liste des données à tester
  const patientInterestTable: PatientInterestTable = {
    patient_id: 3,
    interest_id: 7,
  };
  const patientInterestModel: PatientInterestModel = {
    patientId: 3,
    interestId: 7,
  };
  const patientInterestMapper = new PatientInterestMapper();

  // Test de la fonction de mapping table -> model
  it('> mapTableToModel', () => {
    expect(
      patientInterestMapper.mapTableToModel(patientInterestTable)
    ).toStrictEqual(patientInterestModel);
  });

  // Test de la fonction de mapping model -> table
  it('> mapModelToTable', () => {
    expect(
      patientInterestMapper.mapModelToTable(patientInterestModel)
    ).toStrictEqual(patientInterestTable);
  });

  // Test de la fonction de mapping table -> model -> table
  it('> mapTableToModel > mapModelToTable', () => {
    expect(patientInterestTable).toStrictEqual(
      patientInterestMapper.mapModelToTable(
        patientInterestMapper.mapTableToModel(patientInterestTable)
      )
    );
  });
});

// Test du mapper PatientMapper
describe('PatientMapper', () => {
  // Liste des données à tester
  const patientTable: PatientTable = {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    birth_date: '1990-01-01 10:05:32',
    gender: 'MALE',
    notes: 'Test note',
    created_at: '2024-01-01 15:25:45',
  };
  const patientModel: PatientModel = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    birthDate: new Date(1990, 0, 1, 10, 5, 32),
    gender: 'MALE',
    notes: 'Test note',
    createdAt: new Date(2024, 0, 1, 15, 25, 45),
  };
  const patientMapper = new PatientMapper();

  // Test de la fonction de mapping table -> model
  it('> mapTableToModel', () => {
    expect(patientMapper.mapTableToModel(patientTable)).toStrictEqual(
      patientModel
    );
  });

  // Test de la fonction de mapping model -> table
  it('> mapModelToTable', () => {
    expect(patientMapper.mapModelToTable(patientModel)).toStrictEqual(
      patientTable
    );
  });

  // Test de la fonction de mapping table -> model -> table
  it('> mapTableToModel > mapModelToTable', () => {
    expect(patientTable).toStrictEqual(
      patientMapper.mapModelToTable(patientMapper.mapTableToModel(patientTable))
    );
  });
});

// Test du mapper ResourceMapper
describe('ResourceMapper', () => {
  // Liste des données à tester
  const resourceTable: ResourceTable = {
    id: 5,
    name: 'Image Test',
    type: 'IMAGE',
    file_path: '/path/to/file.png',
    created_at: '2024-01-01 15:25:45',
  };
  const resourceModel: ResourceModel = {
    id: 5,
    name: 'Image Test',
    type: 'IMAGE',
    filePath: '/path/to/file.png',
    createdAt: new Date(2024, 0, 1, 15, 25, 45),
  };
  const resourceMapper = new ResourceMapper();

  // Test de la fonction de mapping table -> model
  it('> mapTableToModel', () => {
    expect(resourceMapper.mapTableToModel(resourceTable)).toStrictEqual(
      resourceModel
    );
  });

  // Test de la fonction de mapping model -> table
  it('> mapModelToTable', () => {
    expect(resourceMapper.mapModelToTable(resourceModel)).toStrictEqual(
      resourceTable
    );
  });

  // Test de la fonction de mapping table -> model -> table
  it('> mapTableToModel > mapModelToTable', () => {
    expect(resourceTable).toStrictEqual(
      resourceMapper.mapModelToTable(
        resourceMapper.mapTableToModel(resourceTable)
      )
    );
  });
});

// Test du mapper SessionExerciseMapper
describe('SessionExerciseMapper', () => {
  // Liste des données à tester
  const sessionExerciseTable: SessionExerciseTable = {
    id: 8,
    session_id: 2,
    exercise_id: 4,
    status: 'DONE',
  };
  const sessionExerciseModel: SessionExerciseModel = {
    id: 8,
    sessionId: 2,
    exerciseId: 4,
    status: 'DONE',
  };
  const sessionExerciseMapper = new SessionExerciseMapper();

  // Test de la fonction de mapping table -> model
  it('> mapTableToModel', () => {
    expect(
      sessionExerciseMapper.mapTableToModel(sessionExerciseTable)
    ).toStrictEqual(sessionExerciseModel);
  });

  // Test de la fonction de mapping model -> table
  it('> mapModelToTable', () => {
    expect(
      sessionExerciseMapper.mapModelToTable(sessionExerciseModel)
    ).toStrictEqual(sessionExerciseTable);
  });

  // Test de la fonction de mapping table -> model -> table
  it('> mapTableToModel > mapModelToTable', () => {
    expect(sessionExerciseTable).toStrictEqual(
      sessionExerciseMapper.mapModelToTable(
        sessionExerciseMapper.mapTableToModel(sessionExerciseTable)
      )
    );
  });
});

// Test du mapper SessionMapper
describe('SessionMapper', () => {
  // Liste des données à tester
  const sessionTable: SessionTable = {
    id: 12,
    patient_id: 3,
    date: '2024-02-01 15:25:45',
    status: 'LATE',
    notes: 'Initial session',
    created_at: '2024-01-01 15:25:45',
  };
  const sessionModel: SessionModel = {
    id: 12,
    patientId: 3,
    date: new Date(2024, 1, 1, 15, 25, 45),
    status: 'LATE',
    notes: 'Initial session',
    createdAt: new Date(2024, 0, 1, 15, 25, 45),
  };
  const sessionMapper = new SessionMapper();

  // Test de la fonction de mapping table -> model
  it('> mapTableToModel', () => {
    expect(sessionMapper.mapTableToModel(sessionTable)).toStrictEqual(
      sessionModel
    );
  });

  // Test de la fonction de mapping model -> table
  it('> mapModelToTable', () => {
    expect(sessionMapper.mapModelToTable(sessionModel)).toStrictEqual(
      sessionTable
    );
  });

  // Test de la fonction de mapping table -> model -> table
  it('> mapTableToModel > mapModelToTable', () => {
    expect(sessionTable).toStrictEqual(
      sessionMapper.mapModelToTable(sessionMapper.mapTableToModel(sessionTable))
    );
  });
});
