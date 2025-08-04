export const ASISTENTES_LESSON_ID_MAPPING: Record<number, string> = {
  1.1: 'cmdsziu3w0001e5ao9kf1iqnh',
  1.2: 'cmdsziu8p0003e5aof9isqghh',
  1.3: 'cmdsziub30005e5aose3jmlkc',
  1.4: 'cmdsziudi0007e5aod3itk745',
  2.1: 'cmdsziufw0009e5aol87339z2',
  2.2: 'cmdsziuia000be5aoonmaky6k',
  2.3: 'cmdsziuko000de5aog4u9lxz5',
  3.1: 'cmdsziun2000fe5ao1jtbran3',
  3.2: 'cmdsziuph000he5aourkr5t1i',
  3.3: 'cmdsziurw000je5ao9omf2odc',
  3.4: 'cmdsziuu9000le5aobg7je8p6',
  4.1: 'cmdsziuwo000ne5aolwpkgsl1',
  4.2: 'cmdsziuz2000pe5aoco6iiuje',
  4.3: 'cmdsziv1h000re5ao0a2w1mkf',
  4.4: 'cmdsziv3v000te5aoo22nck44',
  5.1: 'cmdsziv69000ve5ao5tog460x',
  5.2: 'cmdsziv8o000xe5aoxqhkk651',
  5.3: 'cmdszivb2000ze5ao3eccaj4f',
  5.4: 'cmdszivdg0011e5aorowmnx4l',
  5.5: 'cmdszivfv0013e5aowzs8cmd9',
  5.6: 'cmdszivi90015e5aog2xc0rl2'
};

export function getAsistentesLessonId(numericId: number): string {
  return ASISTENTES_LESSON_ID_MAPPING[numericId] || '';
}