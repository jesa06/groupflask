import sys
from math import sqrt
from random import randint
import pygame
from flask import Blueprint, jsonify
from flask_restful import Api, Resource
 
# 전역 변수
Tetris_sites = Blueprint('Tetris_sites', __name__,
                   url_prefix='/tetris')
api = Api(Tetris_sites)

pygame.init()
smallfont = pygame.font.SysFont(None, 36)
largefont = pygame.font.SysFont(None, 72)
 
BLACK = (0,0,0)
pygame.key.set_repeat(30, 30)
SCREEN_WIDTH = 600
SCREEN_HEIGHT = 600
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
clock = pygame.time.Clock()
WIDTH = 12
HEIGHT = 22
INTERVAL = 40
# TODO : FILED값을 채운다.
FIELD = []
COLORS = ((0, 0, 0), (255, 165, 0), (0, 0, 255), (0, 255, 255), \
          (0, 255, 0), (255, 0, 255), (255, 255, 0), (255, 0, 0), (128, 128, 128))
BLOCK = None
NEXT_BLOCK = None
PIECE_SIZE = 24 # 24 x 24
PIECE_GRID_SIZE = PIECE_SIZE+1 
BLOCK_DATA = (
    (
        (0, 0, 1, \
         1, 1, 1, \
         0, 0, 0),
        (0, 1, 0, \
         0, 1, 0, \
         0, 1, 1),
        (0, 0, 0, \
         1, 1, 1, \
         1, 0, 0),
        (1, 1, 0, \
         0, 1, 0, \
         0, 1, 0),
    ), (
        (2, 0, 0, \
         2, 2, 2, \
         0, 0, 0),
        (0, 2, 2, \
         0, 2, 0, \
         0, 2, 0),
        (0, 0, 0, \
         2, 2, 2, \
         0, 0, 2),
        (0, 2, 0, \
         0, 2, 0, \
         2, 2, 0)
    ), (
        (0, 3, 0, \
         3, 3, 3, \
         0, 0, 0),
        (0, 3, 0, \
         0, 3, 3, \
         0, 3, 0),
        (0, 0, 0, \
         3, 3, 3, \
         0, 3, 0),
        (0, 3, 0, \
         3, 3, 0, \
         0, 3, 0)
    ), (
        (4, 4, 0, \
         0, 4, 4, \
         0, 0, 0),
        (0, 0, 4, \
         0, 4, 4, \
         0, 4, 0),
        (0, 0, 0, \
         4, 4, 0, \
         0, 4, 4),
        (0, 4, 0, \
         4, 4, 0, \
         4, 0, 0)
    ), (
        (0, 5, 5, \
         5, 5, 0, \
         0, 0, 0),
        (0, 5, 0, \
         0, 5, 5, \
         0, 0, 5),
        (0, 0, 0, \
         0, 5, 5, \
         5, 5, 0),
        (5, 0, 0, \
         5, 5, 0, \
         0, 5, 0)
    ), (
        (6, 6, \
        6, 6),
        (6, 6, \
        6, 6),
        (6, 6, \
        6, 6),
        (6, 6, \
        6, 6)
    ), (
        (0, 7, 0, 0, \
         0, 7, 0, 0, \
         0, 7, 0, 0, \
         0, 7, 0, 0),
        (0, 0, 0, 0, \
         7, 7, 7, 7, \
         0, 0, 0, 0, \
         0, 0, 0, 0),
        (0, 0, 7, 0, \
         0, 0, 7, 0, \
         0, 0, 7, 0, \
         0, 0, 7, 0),
        (0, 0, 0, 0, \
         0, 0, 0, 0, \
         7, 7, 7, 7, \
         0, 0, 0, 0)
    )
)
 
class Block:
    """ 블록 객체 """
    def __init__(self, count):
        self.turn = 0 # TODO : 다양한 모양이 나오게 변경하기 
        self.type = BLOCK_DATA[0] # TODO : 다양한 모양이 나오게 변경하기 
        self.data = self.type[self.turn]
        self.size = int(sqrt(len(self.data)))
        self.xpos = randint(2, 8 - self.size)
        self.ypos = 1 - self.size
        self.fire = count + INTERVAL
 
    def update(self, count):
        """ 블록 상태 갱신 (소거한 단의 수를 반환한다) """
        # 아래로 충돌?
        erased = 0
        if is_overlapped(self.xpos, self.ypos + 1, self.turn):
            for y_offset in range(BLOCK.size):
                for x_offset in range(BLOCK.size):
                    index = y_offset * self.size + x_offset
                    val = BLOCK.data[index]
                    if 0 <= self.ypos+y_offset < HEIGHT and \
                       0 <= self.xpos+x_offset < WIDTH and val != 0:
                            FIELD[self.ypos+y_offset][self.xpos+x_offset] = val ## 값을 채우고, erase_line()을 통해 삭제되도록 한다.
 
            erased = erase_line()
            go_next_block(count)
 
        if self.fire < count:
            self.fire = count + INTERVAL
            self.ypos += 1
        return erased
 
    def draw(self):
        """ 블록을 그린다 """
        pass
 
def erase_line():
    """ TODO : 행이 모두 찬 단을 지운다. 그리고, 소거한 단의 수를 반환한다 """
    erased = 0
    return erased
 
def is_game_over():
    """ TODO : 게임 오버인지 아닌지 """
    pass
 
def go_next_block(count):
    """ 블록을 생성하고, 다음 블록으로 전환한다 """
    global BLOCK, NEXT_BLOCK
    BLOCK = NEXT_BLOCK if NEXT_BLOCK != None else Block(count)
    NEXT_BLOCK = Block(count)
 
def is_overlapped(xpos, ypos, turn):
    """ TODO : 블록이 벽이나 땅의 블록과 충돌하는지 아닌지 """
    pass
 
def set_game_field():
    """ TODO : 필드 구성을 위해 FIELD 값을 세팅한다. """
    pass
 
def draw_game_field():
    """ TODO : 필드를 그린다 """
    pass
 
def draw_current_block():
    """ TODO : 현재 블록을 그린다 """
    pass
 
def draw_next_block():
    """ TODO : 다음 블록을 그린다 """
    pass
 
def draw_score(score):
    """ TODO : 점수를 표시한다. """
    pass
 
def draw_gameover_message():
    """ TODO : 'Game Over' 문구를 표시한다 """
    pass
 
def runGame():
    """ 메인 루틴 """
    global INTERVAL
    count = 0
    score = 0
    game_over = False
    
    go_next_block(INTERVAL)
 
    set_game_field()
 
    while True:
        clock.tick(10)
        screen.fill(BLACK)
 
        key = None
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            elif event.type == pygame.KEYDOWN:
                key = event.key
            elif event.type == pygame.KEYUP:
                key = None
 
        game_over = is_game_over()
        if not game_over:
            count += 5
            if count % 1000 == 0:
                INTERVAL = max(1, INTERVAL - 2)
            erased = BLOCK.update(count)
 
            if erased > 0:
                score += (2 ** erased) * 100
 
            # 키 이벤트 처리
            next_x, next_y, next_t = \
                BLOCK.xpos, BLOCK.ypos, BLOCK.turn
            if key == pygame.K_UP:
                next_t = (next_t + 1) % 4
            elif key == pygame.K_RIGHT:
                next_x += 1
            elif key == pygame.K_LEFT:
                next_x -= 1
            elif key == pygame.K_DOWN:
                next_y += 1
 
            if not is_overlapped(next_x, next_y, next_t):
                BLOCK.xpos = next_x
                BLOCK.ypos = next_y
                BLOCK.turn = next_t
                BLOCK.data = BLOCK.type[BLOCK.turn]
 
        # 게임필드 그리기
        draw_game_field()
 
        # 낙하 중인 블록 그리기
        draw_current_block()
 
        # 다음 블록 그리기
        draw_next_block()
        
        # 점수 나타내기
        draw_score(score)
        
        # 게임 오버 메시지 
        if game_over:
            draw_gameover_message()
 
        pygame.display.update()
        
 
runGame()
pygame.quit()
